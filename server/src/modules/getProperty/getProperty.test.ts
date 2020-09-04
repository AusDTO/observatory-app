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

const { email, password, name, role } = testUser;

const client = new TestClient();
const { service_name, domain, ua_id } = testProperies[0];
let propertyId: string;

beforeAll(async () => {
  await connection.create();
  //FIX. REFACTOR, shouldn't have to include this code in every test file,
  const { emailHost } = testAgency;
  const agency1 = Agency.create({ emailHost, name: testAgency.name });
  await agency1.save();

  const user1 = User.create({
    email,
    password,
    name,
    role,
    verified: true,
  });

  user1.agency = agency1 as Agency;

  const propertyToInsert = Property.create({ service_name, domain, ua_id });
  propertyToInsert.agency = agency1 as Agency;
  await Property.save(propertyToInsert);

  propertyId = propertyToInsert.id;

  await user1.save();

  const agency2Data = testAgency2;
  const agency2 = Agency.create({
    emailHost: agency2Data.emailHost,
    name: agency2Data.name,
  });
  await agency2.save();

  const user2 = User.create({
    email: "testuser@bla.gov.au",
    password,
    name,
    role,
    verified: true,
  });

  user2.agency = agency2 as Agency;

  await user2.save();
});

afterAll(async () => {
  await connection.close();
});

describe("Test accessing properties", () => {
  test("Not logged in, should return error", async () => {
    // await client.login(email, password);

    const result = await client.getProperty(propertyId);
    const { __typename, message } = result.data.getProperty;

    expect(__typename).toEqual("Error");
    expect(message).toContain("Not authenticated");
  });

  test("Logged in should return a property", async () => {
    await client.login(email, password);

    const result = await client.getProperty(propertyId);

    const apiResponse = result.data.getProperty;

    expect(apiResponse.__typename).toEqual("Property");
    expect(apiResponse.service_name).toEqual(service_name);
    await client.logout();
  });

  test("Users can only access their own agencies properties", async () => {
    await client.login("testuser@bla.gov.au", password);
    const result = await client.getProperty(propertyId);
    const { __typename, message } = result.data.getProperty;

    expect(__typename).toEqual("Error");
    expect(message).toEqual("You don't have access to this property");
    await client.logout();
  });

  test("Invalid uuid returns error", async () => {
    await client.login(email, password);

    const result = await client.getProperty("inavlid-uuid");

    const { __typename, errors } = result.data.getProperty;

    expect(__typename).toEqual("FieldErrors");
    expect(errors[0].message).toEqual("We could not find the property");
  });

  test("Property doesn't exist error", async () => {
    const fakeUUID = "4aa5a0c2-3134-4eed-afd9-0f7580752545";
    await client.login(email, password);

    const result = await client.getProperty(fakeUUID);
    const { __typename, message } = result.data.getProperty;
    expect(__typename).toEqual("Error");
    expect(message).toEqual("Property not found");
  });
});
