import { User } from "../../entity/User";
import { connection } from "../../util/createConnection";
import { testUser } from "../../util/testData";
import { TestClient } from "../../util/testClient";
import { getConnection } from "typeorm";

const { email, password, name, role, emailHost } = testUser;

const client = new TestClient();

beforeAll(async () => {
  await connection.create();

  const user = User.create({
    email,
    password,
    name,
    role,
    emailHost,
  });
  await user.save();
});

afterAll(async () => {
  await getConnection().getRepository(User).delete({});

  await connection.close();
});

describe("Login user", () => {
  test("Without being verified", async () => {
    const result = await client.login(email, password);

    const { login } = result.data;
    const { message } = login;
    expect(login.__typename).toEqual("Error");
    expect(message).toContain("check your email for a confirmation link");
  });

  test("Test login with verified user", async () => {
    //first verify the user
    await User.update({ email }, { verified: true });
    const result = await client.login(email, password);

    const { login } = result.data;
    const { message } = login;

    expect(login.__typename).toEqual("Success");
    expect(message).toEqual("Login succeeded");
  });

  test("Test invalid credentials", async () => {
    const result = await client.login(email, "123!@#PASSword");

    const { login } = result.data;
    const { message } = login;
    expect(login.__typename).toEqual("Error");
    expect(message).toEqual("Email or password is invalid");
  });

  test("Cookie is set", async () => {
    const newClient = new TestClient();
    const response = await newClient.getUser();
    let { getUser } = response.data;

    expect(getUser).toBeNull();

    await newClient.login(email, password);

    const response2 = await newClient.getUser();

    const data2 = response2.data.getUser;
    expect(data2.email).toEqual(email);
  });
});
