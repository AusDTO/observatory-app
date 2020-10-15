import { getConnection, getManager } from "typeorm";
import { Agency } from "../../../entity/Agency";
import { Outputs } from "../../../entity/Output";
import { Property } from "../../../entity/Property";
import { User } from "../../../entity/User";
import { ADMIN_EMAILS } from "../../../util/constants";
import { connection } from "../../../util/createConnection";
import { TestClient } from "../../../util/testClient";
import { testUser, execDailyData } from "../../../util/testData";

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

  const dataToInsert = Outputs.create({
    type: "exec_daily",
    property,
    output: execDailyData.output,
  });

  await dataToInsert.save();

  const loginResponse = await client.loginAdminUser(adminEmail, password);
  const data = await loginResponse.json();
  accessToken = data.accessToken;
});

afterAll(async () => {
  await getConnection().getRepository(Outputs).delete({});
  await getConnection().getRepository(Property).delete({});
  await getConnection().getRepository(Agency).delete({});
  await connection.close();
});

beforeEach(async () => {
  const manager = getManager();
});

describe("Edit data suite", () => {
  test("Editing data", async () => {
    const newData = {
      output: [
        {
          timeOnPage: "25minutes20seconds",
          date: "01/01/2020",
          pageViews: "999999",
          sessions: "2099",
          bounceRate: "55%",
          aveSessionsPerUser: "20",
          pagesPerSession: "1.4",
          aveSessionDuration: "10",
          newUsers: "20",
          returningUsers: "20",
        },
      ],
    };

    const response = await client.editDataOutput(
      accessToken,
      ua_id,
      "exec_daily",
      JSON.stringify(newData)
    );

    const data = await response.json();

    expect(data.statusCode).toEqual(200);

    const res2 = await client.fetchOutputData(accessToken);

    const data2 = await res2.json();

    expect(data2[0].output[0].timeOnPage).toEqual("25minutes20seconds");
  });
});
