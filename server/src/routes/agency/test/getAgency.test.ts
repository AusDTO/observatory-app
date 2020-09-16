import { User } from "../../../entity/User";

import { testUser, testAgency } from "../../../util/testData";
import { TestClient } from "../../../util/testClient";
import { ADMIN_EMAILS } from "../../../util/constants";
import { connection } from "../../../util/createConnection";
import { getConnection } from "typeorm";
import { Agency } from "../../../entity/Agency";

const client = new TestClient();
let adminEmail = ADMIN_EMAILS[0] as string;
let accessToken: string;

const { password, name, role, emailHost } = testUser;
beforeAll(async () => {
  await connection.create();
  await getConnection().getRepository(Agency).delete({});

  const user2 = User.create({
    email: adminEmail,
    password,
    role,
    name,
    emailHost,
  });
  user2.verified = true;
  user2.isAdmin = true;
  await user2.save();

  const loginResponse = await client.loginAdminUser(adminEmail, password);
  const data = await loginResponse.json();
  accessToken = data.accessToken;
  await getConnection().getRepository(User).delete({});
  const agency1 = Agency.create({
    name: testAgency.name,
    emailHosts: testAgency.emailHosts,
  });
  await agency1.save();
});

afterAll(async () => {
  await getConnection().getRepository(User).delete({});
  await getConnection().getRepository(Agency).delete({});

  await connection.close();
});

describe("Agency crud operations", () => {
  test("Get agency by name", async () => {
    const res = await client.getAgenciesByName(accessToken, "DTA");
    const agency = await res.json();
    expect(res.status).toEqual(200);

    expect(agency).toBeTruthy;
    expect(agency.name).toEqual("DTA");
  });

  test("Get agency with name that doesn't exist", async () => {
    const res = await client.getAgenciesByName(accessToken, "BLA");

    expect(res.status).toEqual(404);
  });
});
