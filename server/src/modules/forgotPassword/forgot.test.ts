import Redis from "ioredis";
import { User } from "../../entity/User";
import { connection } from "../../util/createConnection";
import { testData } from "../../util/testData";
import { TestClient } from "../../util/testClient";
import { CreateForgotPasswordLink } from "../../util/forgotPassword/createForgotPasswordLink";
import { REDIS_FORGOT_PASSWORD_PREFIX } from "../../util/constants";

const { email, password, name, agency, role } = testData;
let userID: string;
const newPassword = "123!@#PASSword";

const client = new TestClient();
const redis_client = new Redis();

beforeAll(async () => {
  await connection.create();
  const user = User.create({
    email,
    password,
    name,
    agency,
    role,
    verified: true,
  });
  await user.save();
  userID = user.id;
});

afterAll(async () => {
  await connection.close();
});

describe("Send forgot password email", () => {
  test("Invalid email", async () => {
    const response = await client.sendForgotPassword("bla@bla.com");
    const { __typename } = response.data.sendForgotPasswordEmail;
    expect(__typename).toEqual("FieldErrors");
  });

  test("User not existing", async () => {
    const response = await client.sendForgotPassword("bla@bla.gov.au");
    const { __typename } = response.data.sendForgotPasswordEmail;
    expect(__typename).toEqual("Error");
  });

  test("User exists", async () => {
    const response = await client.sendForgotPassword(email);
    const { __typename } = response.data.sendForgotPasswordEmail;
    expect(__typename).toEqual("Success");
  });
});

describe("Reset password", () => {
  test("Login with new password", async () => {
    const resetPasswordLink = await CreateForgotPasswordLink(
      userID,
      redis_client
    );

    const splitLink = resetPasswordLink.split("/");
    const key = splitLink[splitLink.length - 1];

    const forgotPasswordKey = `${REDIS_FORGOT_PASSWORD_PREFIX}${key}`;

    const userId = (await redis_client.get(forgotPasswordKey)) as string;

    const user = await User.findOne({ id: userId });
    expect(user?.email).toEqual(email);
    console.log(user?.id);

    await client.resetPassword(newPassword, key);

    //can't login with old credentials, now that password has changed
    const loginResponse = await client.login(email, password);
    const { __typename } = loginResponse.data.login;
    expect(__typename).toEqual("Error");

    //can login with new credentials
    const loginResponse2 = await client.login(email, newPassword);
    const __typename2 = loginResponse2.data.login.__typename;
    expect(__typename2).toEqual("Success");

    //check redis key deleted

    expect(await redis_client.get(forgotPasswordKey)).toBeNull();
  });

  test("invalid password", async () => {
    const result = await client.resetPassword("sdasd", "key");
    const response = result.data.resetPassword;
    expect(response.__typename).toEqual("FieldErrors");
    expect(response.errors[0].path).toEqual("newPassword");
  });

  test("No key provided", async () => {
    const result = await client.resetPassword("Password123!@#", "");
    const response = result.data.resetPassword;
    expect(response.__typename).toEqual("FieldErrors");
    expect(response.errors[0].path).toEqual("key");
  });

  test("Key that does not exist", async () => {
    const result = await client.resetPassword("Password123!@#", "2314afaf");
    const { __typename, message } = result.data.resetPassword;
    expect(__typename).toEqual("Error");
    expect(message).toEqual("Expired key or not found");
  });

  test("Key for invalid user", async () => {
    const resetPasswordLink = await CreateForgotPasswordLink(
      "asdfasfasdfas",
      redis_client
    );

    const splitLink = resetPasswordLink.split("/");
    const key = splitLink[splitLink.length - 1];

    const result = await client.resetPassword("Password123!@#", key);
    const { __typename, message } = result.data.resetPassword;
    expect(__typename).toEqual("Error");
    expect(message).toEqual("User not found");
  });
});
