import { User } from "../../../entity/User";

import {
  testUser,
  agencyListTwoItems,
  agencyListDuplicateItems,
} from "../../../util/testData";
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

  const user1 = User.create({
    email: adminEmail,
    password,
    role,
    name,
    emailHost,
  });
  user1.verified = true;
  user1.isAdmin = true;
  await user1.save();

  const loginResponse = await client.loginAdminUser(adminEmail, password);
  const data = await loginResponse.json();
  accessToken = data.accessToken;
  await getConnection().getRepository(User).delete({});
});

afterAll(async () => {
  await getConnection().getRepository(Agency).delete({});

  await connection.close();
});

beforeEach(async () => {
  await getConnection().getRepository(Agency).delete({});
});

describe("Multiple agencies", () => {
  test("Add 2 agencies successfully", async () => {
    const bodyData = JSON.stringify(agencyListTwoItems);
    const response = await client.addAgency(bodyData, accessToken);
    const { statusCode, message } = await response.json();
    expect(statusCode).toEqual(200);
    expect(message).toEqual(
      `${agencyListTwoItems.length} entries for agency data added successfully`
    );

    const b = await client.getAgencies(accessToken);
    const c = await Agency.find();

    const a = await Agency.find();

    // expect(a[0].emailHosts).toHaveLength(3);
    expect(a).toHaveLength(2);
  });

  test("Adding duplicated agencies removes duplicates", async () => {
    const bodyData = JSON.stringify(agencyListDuplicateItems);
    const response = await client.addAgency(bodyData, accessToken);
    const { message, statusCode } = await response.json();
    expect(statusCode).toEqual(200);
    expect(message).toEqual(
      `${
        agencyListDuplicateItems.length - 1
      } entries for agency data added successfully`
    );

    const getAgenciesResponse = await client.getAgencies(accessToken);
    await getAgenciesResponse.json();
    const getAgenciesData = await Agency.find();

    expect(getAgenciesData).toHaveLength(2);
  });
});
