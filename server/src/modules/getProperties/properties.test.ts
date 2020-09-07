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
const propertiesTestData = testProperies;

beforeAll(async () => {
  await connection.create();
  //FIX. REFACTOR, shouldn't have to include this code in every test file,
  const agency = Agency.create({ name: testAgency.name });
  await agency.save();

  const user = User.create({
    email,
    password,
    name,
    role,
    verified: true,
  });

  user.agency = agency as Agency;

  propertiesTestData.forEach(async (property) => {
    const propertyToInsert = Property.create({ ...property });
    propertyToInsert.agency = agency as Agency;
    await Property.save(propertyToInsert);
  });

  await user.save();

  const agency2Data = testAgency2;
  const agency2 = Agency.create({
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
  test("Not logged in", async () => {
    // await client.login(email, password);

    const result = await client.getProperties();
    const { __typename, message } = result.data.getUserProperties;

    expect(__typename).toEqual("Error");
    expect(message).toContain("Not authenticated");
  });

  test("Logged in should return properties", async () => {
    await client.login(email, password);

    const result = await client.getProperties();

    const { __typename, properties } = result.data.getUserProperties;

    expect(__typename).toEqual("PropertyList");
    expect(properties).toHaveLength(2);
  });

  test("User belonging to agency without any properties should return NoProperties error", async () => {
    await client.login("testuser@bla.gov.au", password);
    const result = await client.getProperties();

    const { __typename } = result.data.getUserProperties;
    expect(__typename).toEqual("NoProperties");
  });
});
