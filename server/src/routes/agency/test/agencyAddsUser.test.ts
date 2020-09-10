import { User } from "../../../entity/User";

import {
  testUser,
  agencyListOneItem,
  agencyListTwoItems,
  agencyListDuplicateItems,
} from "../../../util/testData";
import { TestClient } from "../../../util/testClient";
import { ADMIN_EMAILS } from "../../../util/constants";
import { connection } from "../../../util/createConnection";
import { getConnection, getManager } from "typeorm";
import { Agency } from "../../../entity/Agency";
import { v4 as uuid } from "uuid";

const client = new TestClient();
let adminEmail = ADMIN_EMAILS[0] as string;
let accessToken: string;

const { password, name, role, emailHost } = testUser;
beforeAll(async () => {
  await connection.create();
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
  await getConnection().getRepository(User).delete({});

  await connection.close();
});

beforeEach(async () => {
  await getConnection().getRepository(Agency).delete({});
});

describe("Agency adds user", () => {
  test("Adding agency adds agency to existing users with same email but not to users with another email host", async () => {
    const { email, password, name, role, emailHost } = testUser;

    const user1 = User.create({
      email,
      password,
      name,
      role,
      emailHost,
    });

    const user2 = User.create({
      email: "test@test.gov.au",
      password,
      name,
      role,
      emailHost: "@test.gov.au",
    });

    await user1.save();
    await user2.save();
    const userId = user1.id;
    const user2Id = user2.id;

    expect(user1.agency).toBeFalsy();

    const bodyData = JSON.stringify(agencyListOneItem);
    await client.addAgency(bodyData, accessToken);
    await client.getAgencies(accessToken);
    const b = await client.getAgencies(accessToken);

    const agencies = await Agency.find();

    const user1AfterUpdating = await User.findOne({
      where: { id: userId },
      relations: ["agency"],
    });

    const user2AfterUpdating = await User.findOne({
      where: { id: user2Id },
      relations: ["agency"],
    });

    expect(user1AfterUpdating?.agency.name).toEqual(agencyListOneItem[0].name);
    expect(user2AfterUpdating?.agency).toBeFalsy();
  });
});
