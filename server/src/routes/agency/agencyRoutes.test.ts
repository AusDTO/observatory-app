import { User } from "../../entity/User";
import node_fetch from "node-fetch";

import {
  testUser,
  agencyListOneItem,
  agencyListTwoItems,
  agencyListDuplicateItems,
} from "../../util/testData";
import { TestClient } from "../../util/testClient";
import { ADMIN_EMAILS } from "../../util/constants";
import { connection } from "../../util/createConnection";
import { getConnection, getRepository } from "typeorm";
import { Agency } from "../../entity/Agency";
import { v4 as uuid } from "uuid";

const client = new TestClient();
let adminEmail = ADMIN_EMAILS[0] as string;
let accessToken: string;

const { password, name, role } = testUser;
beforeAll(async () => {
  await connection.create();
  const user2 = User.create({
    email: adminEmail,
    password,
    role,
    name,
  });
  user2.verified = true;
  user2.isAdmin = true;
  await user2.save();

  const loginResponse = await client.loginAdminUser(adminEmail, password);
  const data = await loginResponse.json();
  accessToken = data.accessToken;
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  await getConnection().getRepository(Agency).delete({});
});

describe("Confirmation link", () => {
  test("returns null array when no agencies added", async () => {
    const response = await client.getAgencies(accessToken);

    const data = (await response.json()) as Array<any>;
    expect(data.length).toEqual(0);
  });

  test("Adding agency with good data, and then trying to add dupe agency", async () => {
    const bodyData = JSON.stringify(agencyListOneItem);
    const response = await client.addAgency(bodyData, accessToken);
    const { statusCode, message } = await response.json();
    expect(statusCode).toEqual(200);
    expect(message).toEqual(
      `${agencyListOneItem.length} entries for agency data added successfully`
    );

    const getAgenciesResponse = await client.getAgencies(accessToken);
    const getAgenciesData = await getAgenciesResponse.json();

    expect(getAgenciesData).toHaveLength(1);

    const response2 = await client.addAgency(bodyData, accessToken);
    const data = await response2.json();

    expect(data.statusCode).toEqual(400);
    expect(data.fieldErrors[0]).toContain("data was not posted successfully");
  });

  test("Add 2 agencies successfully", async () => {
    const bodyData = JSON.stringify(agencyListTwoItems);
    const response = await client.addAgency(bodyData, accessToken);
    const { statusCode, message } = await response.json();
    expect(statusCode).toEqual(200);
    expect(message).toEqual(
      `${agencyListTwoItems.length} entries for agency data added successfully`
    );
    const getAgenciesResponse = await client.getAgencies(accessToken);
    const getAgenciesData = await getAgenciesResponse.json();

    expect(getAgenciesData).toHaveLength(2);
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
    const getAgenciesData = await getAgenciesResponse.json();

    expect(getAgenciesData).toHaveLength(2);
  });

  test("invalid body data", async () => {
    const bodyData = JSON.stringify({ d: "hello" });
    const response = await client.addAgency(bodyData, accessToken);
    const { statusCode, message } = await response.json();

    expect(statusCode).toEqual(400);
    expect(message).toContain("no unique items");

    const getAgenciesResponse = await client.getAgencies(accessToken);
    const getAgenciesData = await getAgenciesResponse.json();

    expect(getAgenciesData).toHaveLength(0);
  });

  test("Deleting an agency", async () => {
    const bodyData = JSON.stringify([{ name: "Random agency" }]);
    await client.addAgency(bodyData, accessToken);
    const getAgencies = await client.getAgencies(accessToken);
    const getAgenciesData = await getAgencies.json();

    // const id = agency?.id as string;

    expect(getAgenciesData).toHaveLength(1);

    const { id, name } = getAgenciesData[0];

    const deleteResponse = await client.deleteAgency(id, accessToken);
    const { statusCode, message } = await deleteResponse.json();

    expect(statusCode).toEqual(200);
    expect(message).toContain(name);
  });

  test("Deleting agency that doesn't exist", async () => {
    const id = uuid();
    const deleteResponse = await client.deleteAgency(id, accessToken);
    const { statusCode, message } = await deleteResponse.json();

    expect(statusCode).toEqual(400);

    expect(message).toContain("doesn't exist");
  });
});
