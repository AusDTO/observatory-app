import { getConnection, getManager } from "typeorm";
import { Agency } from "../../../entity/Agency";
import { Property } from "../../../entity/Property";
import { User } from "../../../entity/User";
import { ADMIN_EMAILS } from "../../../util/constants";
import { connection } from "../../../util/createConnection";
import { TestClient } from "../../../util/testClient";
import { testUser, weeklyBasicsValidData } from "../../../util/testData";

const client = new TestClient();
let adminEmail = ADMIN_EMAILS[0] as string;
let accessToken: string;
const ua_id = "UA-123985";
const service_name = "Hello";
const domain = "http//www.xyz.gov.au";

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

  const agency1 = Agency.create({
    name: "agency1111",
    emailHosts: ["@digital.gov.au"],
  });
  await agency1.save();

  const property = Property.create({
    ua_id,
    service_name,
    domain,
    agency: agency1,
  });
  await property.save();

  const loginResponse = await client.loginAdminUser(adminEmail, password);
  const data = await loginResponse.json();
  accessToken = data.accessToken;
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  // const manager = getManager();
  // await getConnection().getRepository(Property).delete({});
});

describe("Test inserting BASIC OUTPUT data", () => {
  test("Add valid data", async () => {
    const response = await client.addDataOutput(
      accessToken,
      ua_id,
      JSON.stringify(weeklyBasicsValidData)
    );

    const { statusCode, message } = await response.json();
    expect(statusCode).toEqual(200);
  });

  test("Invalid output data", async () => {});
});
