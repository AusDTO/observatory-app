import Redis from "ioredis";
import { User } from "../../entity/User";
import { connection } from "../../util/createConnection";
import {
  testUser,
  testProperies,
  testAgency,
  testAgency2,
} from "../../util/testData";
import { TestClient } from "../../util/testClient";
import { Agency } from "../../entity/Agency";
import { Property } from "../../entity/Property";
import { getConnection } from "typeorm";

const { email, password, name, role, emailHost } = testUser;

const client = new TestClient();
const { service_name, domain, ua_id } = testProperies[0];
let property_ua_id: string;

beforeAll(async () => {
  await connection.create();
  //FIX. REFACTOR, shouldn't have to include this code in every test file,
  const agency1 = Agency.create({
    name: testAgency.name,
    emailHosts: testAgency.emailHosts,
  });
  await agency1.save();

  const user1 = User.create({
    email,
    password,
    name,
    role,
    emailHost,
    verified: true,
  });

  user1.agency = agency1 as Agency;

  const propertyToInsert = Property.create({ service_name, domain, ua_id });
  propertyToInsert.agency = agency1 as Agency;
  await Property.save(propertyToInsert);

  property_ua_id = propertyToInsert.ua_id;

  await user1.save();

  const agency2Data = testAgency2;
  const agency2 = Agency.create({
    name: agency2Data.name,
    emailHosts: agency2Data.emailHosts,
  });
  await agency2.save();

  const user2 = User.create({
    email: "testuser@bla.gov.au",
    password,
    name,
    role,
    emailHost: "@bla.gov.au",
    verified: true,
  });

  user2.agency = agency2 as Agency;

  await user2.save();
});

afterAll(async () => {
  await getConnection().getRepository(User).delete({});
  await getConnection().getRepository(Property).delete({});
  await getConnection().getRepository(Agency).delete({});
  await connection.close();
});

describe("Test accessing properties", () => {
  test("Not logged in, should return error", async () => {
    // await client.login(email, password);

    const result = await client.getProperty(property_ua_id);
    const { __typename, message } = result.data.getProperty;

    expect(__typename).toEqual("Error");
    expect(message).toContain("Not authenticated");
  });

  test("Logged in should return a property", async () => {
    await client.login(email, password);

    const result = await client.getProperty(property_ua_id);

    const apiResponse = result.data.getProperty;

    expect(apiResponse.__typename).toEqual("Property");
    expect(apiResponse.service_name).toEqual(service_name);
    await client.logout();
  });

  test("Users can only access their own agencies properties", async () => {
    await client.login("testuser@bla.gov.au", password);
    const result = await client.getProperty(property_ua_id);
    const { __typename, message } = result.data.getProperty;

    expect(__typename).toEqual("Error");
    expect(message).toEqual("You don't have access to this property");
    await client.logout();
  });

  test("Invalid ua_id returns error", async () => {
    await client.login(email, password);

    const result = await client.getProperty("UA-asd-23");

    const { __typename, errors } = result.data.getProperty;

    expect(__typename).toEqual("FieldErrors");
    expect(errors[0].message).toEqual(
      "You have entered a UAID that is not valid, check your data and try again"
    );
  });

  test("Property doesn't exist error", async () => {
    const fakeUUID = "UA-1212121";
    await client.login(email, password);

    const result = await client.getProperty(fakeUUID);
    const { __typename, message } = result.data.getProperty;
    expect(__typename).toEqual("Error");
    expect(message).toEqual("Property not found");
  });
});
