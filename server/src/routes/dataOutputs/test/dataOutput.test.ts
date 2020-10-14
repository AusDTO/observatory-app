import { getConnection, getManager } from "typeorm";
import { Agency } from "../../../entity/Agency";
import { Outputs } from "../../../entity/Output";
import { Property } from "../../../entity/Property";
import { User } from "../../../entity/User";
import { ADMIN_EMAILS } from "../../../util/constants";
import { connection } from "../../../util/createConnection";
import { TestClient } from "../../../util/testClient";
import {
  testUser,
  execDailyInvalidOutput,
  execDailyInvalidType,
  execDailyData,
} from "../../../util/testData";

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
  const manager = getManager();
  await getConnection().getRepository(Outputs).delete({});
});

describe("Test inserting BASIC OUTPUT data, and test can't post same type and property again", () => {
  test("Add valid data", async () => {
    const response = await client.addDataOutput(
      accessToken,
      ua_id,
      JSON.stringify(execDailyData)
    );

    const result = await response.json();

    expect(result.statusCode).toEqual(200);

    const response2 = await client.addDataOutput(
      accessToken,
      ua_id,
      JSON.stringify(execDailyData)
    );
    const data = await response2.json();
    expect(data.statusCode).toEqual(409);
  });

  test("Invalid data type", async () => {
    const response = await client.addDataOutput(
      accessToken,
      ua_id,
      JSON.stringify(execDailyInvalidType)
    );

    const { statusCode, message } = await response.json();

    expect(statusCode).toEqual(400);
  });

  test("Invalid data output", async () => {
    const response = await client.addDataOutput(
      accessToken,
      ua_id,
      JSON.stringify(execDailyInvalidOutput)
    );

    const { statusCode, message } = await response.json();

    expect(statusCode).toEqual(400);
  });
});
