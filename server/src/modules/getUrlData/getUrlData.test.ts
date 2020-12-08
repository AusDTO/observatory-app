import Redis from "ioredis";
import { getConnection } from "typeorm";
import { Agency } from "../../entity/Agency";
import { Property } from "../../entity/Property";
import { User } from "../../entity/User";
import { connection } from "../../util/createConnection";
import { TestClient } from "../../util/testClient";
import {
  testAgency,
  testAgency2,
  testProperies,
  testUser,
} from "../../util/testData";

const { email, password, name, role, emailHost } = testUser;

const client = new TestClient();
const { service_name, domain } = testProperies[0];
const ua_id = "ua-11111";
const testUrl = "https://www.dta.gov.au/about-us";
let property_ua_id: string;
const redis_client = new Redis();

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

describe("Test getting URL data", () => {
  test("Not logged in, should return error", async () => {
    // await client.login(email, password);

    const result = await client.getDataFromUrl(ua_id, testUrl, "weekly");
    const { __typename, message } = result.data.getDataFromUrl;
    expect(message).toEqual("Not authenticated");
    expect(__typename).toEqual("Error");
  });

  test("Users from other agencies shouldn't have access", async () => {
    await client.login("testuser@bla.gov.au", password);
    const result = await client.getDataFromUrl(ua_id, testUrl, "weekly");
    const { __typename, message } = result.data.getDataFromUrl;
    expect(message).toEqual("You don't have access to this properties data");
    expect(__typename).toEqual("Error");
  });

  test("Logged in should return url data", async () => {
    await client.login(email, password);
    const result = await client.getDataFromUrl(ua_id, testUrl, "weekly");

    const apiResponse = result.data.getDataFromUrl;

    const { __typename, output } = apiResponse;
    expect(__typename).toEqual("UrlDataResult");
    expect(output).toHaveLength(1);
    await client.logout();
  });
});

describe("Test invalid parameters", () => {
  test("Invalid UA_ID", async () => {
    await client.login(email, password);

    const result = await client.getDataFromUrl("random", testUrl, "weekly");

    const { __typename } = result.data.getDataFromUrl;
    expect(__typename).toEqual("FieldErrors");
    await client.logout();
  });

  test("UA-ID does not exist", async () => {
    await client.login(email, password);
    const result = await client.getDataFromUrl("ua-999999", testUrl, "weekly");
    const { __typename, message } = result.data.getDataFromUrl;
    expect(__typename).toEqual("InvalidProperty");

    await client.logout();
  });

  test("invalid url returns error", async () => {
    await client.login(email, password);

    const result = await client.getDataFromUrl(
      ua_id,
      "dta.gov.au/about-us",
      "weekly"
    );

    const { __typename } = result.data.getDataFromUrl;
    expect(__typename).toEqual("FieldErrors");
    await client.logout();
  });

  test("invalid date type returns error", async () => {
    await client.login(email, password);

    const result = await client.getDataFromUrl(ua_id, testUrl, "weekely");

    const { __typename } = result.data.getDataFromUrl;
    expect(__typename).toEqual("FieldErrors");
    await client.logout();
  });
});

describe("Getting data", () => {
  test("URL doesn't exist", async () => {
    await client.login(email, password);
    const result = await client.getDataFromUrl(
      ua_id,
      "https://www.dta.gov.au/hello",
      "weekly"
    );
    const { __typename, message } = result.data.getDataFromUrl;
    expect(__typename).toEqual("Error");
    expect(message).toContain("No data found");
  });
});

describe("Test caching", () => {
  test("Caches data result successfully", async () => {
    await client.login(email, password);
    const result = await client.getDataFromUrl(ua_id, testUrl, "weekly");

    const apiResponse = result.data.getDataFromUrl;

    const urlTrimmed = testUrl.replace(/(^\w+:|^)\/\//, "").toLowerCase();

    const { __typename, output } = apiResponse;
    expect(__typename).toEqual("UrlDataResult");
    expect(output).toHaveLength(1);
    const cached = (await redis_client.get(
      `urldata:weekly:${urlTrimmed}:${ua_id}`
    )) as string;
    const redis_output = JSON.parse(cached);

    expect(redis_output[0].page_url).toEqual(output[0].page_url);
    await client.logout();
  });

  test("Caches no data found successfully", async () => {
    await client.login(email, password);
    const falsePath = "https://dta.gov.au/non-existing-path";
    const result = await client.getDataFromUrl(ua_id, falsePath, "weekly");

    const apiResponse = result.data.getDataFromUrl;

    const urlTrimmed = falsePath.replace(/(^\w+:|^)\/\//, "").toLowerCase();

    const cached = (await redis_client.get(
      `urldata:weekly:${urlTrimmed}:${ua_id}`
    )) as string;
    const redis_output = JSON.parse(cached);

    expect(redis_output).toBeNull();
    const { __typename } = apiResponse;
    expect(__typename).toEqual("Error");
  });
});
