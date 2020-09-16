import { User } from "../../entity/User";
import { connection } from "../../util/createConnection";
import { testUser } from "../../util/testData";
import { TestClient } from "../../util/testClient";

const { email, password, name, role, emailHost } = testUser;
const emailUser2 = "test@bla.gov.au";

const client = new TestClient();

beforeAll(async () => {
  await connection.create();

  const user2 = User.create({
    email: emailUser2,
    password,
    name,
    role,
    emailHost: "@bla.gov.au",
  });
  await user2.save();

  const user = User.create({
    email,
    password,
    name,
    role,
    emailHost,
  });
  user.isAdmin = true;
  await user.save();
});

afterAll(async () => {
  await connection.close();
});

//FIX: Ideally test with status code messages as well
describe("Login admin user", () => {
  test("Not verified user returns 403 error", async () => {
    const response = await client.loginAdminUser(email, password);
    const data = await response.json();
    expect(data.statusCode).toEqual(403);
  });

  test("User that is not admin returns 403", async () => {
    const response = await client.loginAdminUser(emailUser2, password);
    const data = await response.json();
    expect(data.statusCode).toEqual(403);
  });

  test("User that is admin and verifed returns token", async () => {
    await User.update({ email }, { verified: true });
    const response = await client.loginAdminUser(email, password);
    const data = await response.json();
    expect(data).toHaveProperty("accessToken");
    expect(data.statusCode).toEqual(200);
  });
});

describe("Test invalid fields", () => {
  test("Test invalid email", async () => {
    const response = await client.loginAdminUser("bla", password);
    const data = await response.json();
    expect(data.statusCode).toEqual(400);
    expect(data).toHaveProperty("fieldErrors");
  });

  test("Test invalid password", async () => {
    const response = await client.loginAdminUser(email, "asdfasd");
    const data = await response.json();
    expect(data.statusCode).toEqual(400);
    expect(data).toHaveProperty("fieldErrors");
  });

  test("User does not exist returns 401", async () => {
    const response = await client.loginAdminUser("blabla@lba.gov.au", password);
    const data = await response.json();
    expect(data.statusCode).toEqual(401);
  });
});
