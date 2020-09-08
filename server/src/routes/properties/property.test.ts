import { User } from "../../entity/User";

import { testUser, testAgency } from "../../util/testData";
import { TestClient } from "../../util/testClient";
import { ADMIN_EMAILS } from "../../util/constants";
import { connection } from "../../util/createConnection";
import { getConnection, getRepository } from "typeorm";
import { Agency } from "../../entity/Agency";
import { v4 as uuid } from "uuid";

const client = new TestClient();
let adminEmail = ADMIN_EMAILS[0] as string;
let accessToken: string;
let agencyID: string;

const propertyListInvalidAgencyId = [
  {
    ua_id: "UA-123985",
    service_name: "Hello",
    domain: "http://www.xyz.gov.au",
    agencyId: "c15cb0ae-b6f2-4729-8ed0-289a089a6f72",
  },
];

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

  const agency1 = Agency.create({ name: testAgency.name });
  await agency1.save();

  agencyID = agency1.id;

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
  const propertyListValidId = [
    {
      ua_id: "UA-123985",
      service_name: "Hello",
      domain: "http://www.xyz.gov.au",
      agencyId: agencyID,
    },
  ];
  test("Invalid agency", async () => {
    const bodyData = JSON.stringify(propertyListInvalidAgencyId);
    const response = await client.addProperty(accessToken, bodyData);
    const { statusCode } = await response.json();
    expect(statusCode).toEqual(400);
  });

  test("Valid data", async () => {});
});
