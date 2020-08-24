import { User } from "../../entity/User";
import { connection } from "../../util/createConnection";
import { testData } from "../../util/testData";
import { TestClient } from "../../util/testClient";

const { email, password, name, role } = testData;

const client = new TestClient();

beforeAll(async () => {
  await connection.create();
  await client.register(email, password, name, role);
});

afterAll(async () => {
  await connection.close();
});

describe("Logout user", () => {
  test("Removes cookie after logging out of single session", async () => {
    await User.update({ email }, { verified: true });
    const result = await client.login(email, password);

    const { login } = result.data;
    const { message } = login;

    expect(login.__typename).toEqual("Success");
    expect(message).toEqual("Login succeeded");

    const response = await client.getUser();
    expect(response.data.getUser.email).toEqual(email);

    await client.logout();

    //shouldn't be able to get the user once we've logged out, since cookie is destroyed
    const response2 = await client.getUser();
    let { getUser } = response2.data;

    expect(getUser).toBeNull();
  });

  test("Removes cookie after logging out of multiple session", async () => {
    //each client represents a session
    const client1 = new TestClient();
    const client2 = new TestClient();

    await client1.login(email, password);

    await client2.login(email, password);

    expect(await client1.getUser()).toEqual(await client2.getUser());

    await client1.logout();

    //both sessions should be logged out and therefore equal when we request authenticated space
    expect(await client1.getUser()).toEqual(await client2.getUser());
  });
});
