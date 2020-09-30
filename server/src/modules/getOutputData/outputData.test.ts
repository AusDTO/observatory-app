import Redis from "ioredis";
import { User } from "../../entity/User";
import { connection } from "../../util/createConnection";
import {
  testUser,
  testProperies,
  testAgency,
  testAgency2,
  execDailyData,
} from "../../util/testData";
import { TestClient } from "../../util/testClient";
import { Agency } from "../../entity/Agency";
import { Property } from "../../entity/Property";
import { getConnection } from "typeorm";
import { Outputs } from "../../entity/Output";

const { email, password, name, role, emailHost } = testUser;

const client = new TestClient();
const propertiesTestData = testProperies;

beforeAll(async () => {
  await connection.create();

  //FIX. REFACTOR, shouldn't have to include this code in every test file,
  const agency = Agency.create({
    name: testAgency.name,
    emailHosts: testAgency.emailHosts,
  });
  await agency.save();

  const agency2Data = testAgency2;
  const agency2 = Agency.create({
    name: agency2Data.name,
    emailHosts: agency2Data.emailHosts,
  });
  await agency2.save();

  const user1 = User.create({
    email,
    password,
    name,
    role,
    emailHost,
    verified: true,
  });

  user1.agency = agency as Agency;

  propertiesTestData.forEach(async (property, i) => {
    const propertyToInsert = Property.create({ ...property });
    if (i === 0) {
      propertyToInsert.agency = agency as Agency;
      await Property.save(propertyToInsert);
      const dataToInsert = Outputs.create({
        type: "exec_daily",
        property: propertyToInsert,
        output: execDailyData.output,
      });

      await dataToInsert.save();
    } else {
      propertyToInsert.agency = agency2 as Agency;
      await Property.save(propertyToInsert);
      const dataToInsert = Outputs.create({
        type: "exec_daily",
        property: propertyToInsert,
        output: execDailyData.output,
      });
      await dataToInsert.save();
    }
  });

  await user1.save();

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
  await getConnection().getRepository(Outputs).delete({});
  await getConnection().getRepository(Property).delete({});
  await getConnection().getRepository(Agency).delete({});
  await connection.close();
});

describe("Test getting output data", () => {
  test("Not logged in", async () => {
    const result = await client.getOutputData(
      "exec_daily",
      testProperies[0].ua_id
    );
    const { __typename } = result.data.getOutputData;

    expect(__typename).toEqual("Error");
  });

  test("Logged in", async () => {
    await client.login(email, password);

    const result = await client.getOutputData(
      "exec_daily",
      testProperies[0].ua_id
    );
    const { __typename, output } = result.data.getOutputData;

    expect(__typename).toEqual("ExecDataArray");
    expect(output).toHaveLength(2);
  });

  test("Can't get access to other agency properties", async () => {
    await client.login(email, password);

    const result = await client.getOutputData(
      "exec_daily",
      testProperies[1].ua_id
    );
    const { __typename, message } = result.data.getOutputData;
    expect(__typename).toEqual("Error");

    expect(message).toEqual("You don't have access to this properties data");
  });

  test("Property with ua_ID not found", async () => {
    await client.login(email, password);

    const result = await client.getOutputData("exec_daily", "UA-123123123");
    const { __typename, message } = result.data.getOutputData;
    expect(__typename).toEqual("InvalidProperty");
  });

  test("No data for particular type", async () => {
    const result = await client.getOutputData(
      "exec_weekly",
      testProperies[0].ua_id
    );

    const { __typename, message } = result.data.getOutputData;
    expect(__typename).toEqual("NoOutputData");
  });
});
