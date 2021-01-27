import Redis from "ioredis";
import { getConnection } from "typeorm";
import { Agency } from "../../entity/Agency";
import { Property } from "../../entity/Property";
import { User } from "../../entity/User";
import { REDIS_PEAK_TS_PREFIX } from "../../util/constants";
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
const ua_id = "ua-1111";
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

    const result = await client.getPeakDataTimeSeries(ua_id);
    const { __typename, message } = result.data.getPeakTimeSeriesData;
    expect(message).toEqual("Not authenticated");
    expect(__typename).toEqual("Error");
  });

  test("Users from other agencies shouldn't have access", async () => {
    await client.login("testuser@bla.gov.au", password);
    const result = await client.getPeakDataTimeSeries(ua_id);
    const { __typename, message } = result.data.getPeakTimeSeriesData;
    expect(message).toEqual("You don't have access to this properties data");
    expect(__typename).toEqual("Error");
  });

  test("Logged in should return url data", async () => {
    await client.login(email, password);
    const result = await client.getPeakDataTimeSeries(ua_id);

    const apiResponse = result.data.getPeakTimeSeriesData;

    const { __typename, output } = apiResponse;
    expect(__typename).toEqual("PeakTimeSeriesData");
    expect(output).toHaveLength(24);
    await client.logout();
  });
});

describe("Test invalid parameters", () => {
  test("Invalid UA_ID", async () => {
    await client.login(email, password);

    const result = await client.getPeakDataTimeSeries("random");

    const { __typename } = result.data.getPeakTimeSeriesData;
    expect(__typename).toEqual("FieldErrors");
    await client.logout();
  });

  test("UA-ID does not exist", async () => {
    await client.login(email, password);
    const result = await client.getPeakDataTimeSeries("ua-999999");
    const { __typename, message } = result.data.getPeakTimeSeriesData;
    expect(__typename).toEqual("InvalidProperty");

    await client.logout();
  });

  test("Adding query returns error", async () => {
    await client.login(email, password);
    const result = await client.getPeakDataTimeSeries(
      `${ua_id}; select * from dta_customers.ua61222473_1_peakseries`
    );
    const { __typename, message } = result.data.getPeakTimeSeriesData;
    expect(__typename).toEqual("FieldErrors");
  });
});

describe("Test caching", () => {
  test("Caches data result successfully", async () => {
    await client.login(email, password);
    const result = await client.getPeakDataTimeSeries(ua_id);

    const apiResponse = result.data.getPeakTimeSeriesData;

    const { __typename, output } = apiResponse;

    expect(__typename).toEqual("PeakTimeSeriesData");
    expect(output).toHaveLength(24);
    const cached = (await redis_client.get(
      `${REDIS_PEAK_TS_PREFIX}${ua_id}`
    )) as string;
    console.log(cached);
    const redis_output = JSON.parse(cached);

    expect(redis_output[0].sessions as string).toEqual(output[0].sessions);
    await client.logout();
  });
});
