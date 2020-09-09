import { User } from "../../entity/User";

import { testUser, testAgency, testAgency2 } from "../../util/testData";
import { TestClient } from "../../util/testClient";
import { ADMIN_EMAILS } from "../../util/constants";
import { connection } from "../../util/createConnection";
import { getConnection, getManager } from "typeorm";
import { Agency } from "../../entity/Agency";

import { Property } from "../../entity/Property";

const client = new TestClient();
let adminEmail = ADMIN_EMAILS[0] as string;
let accessToken: string;
let agencyID: string;
let agency2ID: string;
let propertyListValidId: any;
let propertyListTwoItems: any;
let propertyListDuplicateUAID: any;

const propertyListInvalidAgencyId = [
  {
    ua_id: "UA-123985",
    service_name: "Hello",
    domain: "http://www.xyz.gov.au",
    agencyId: "c15cb0ae-b6f2-4729-8ed0-289a089a6f72",
  },
];

const invalidJSON = [
  {
    uad_id: "UA-123985",
    service_name: "Hello",
    domain: "http://www.xyz.gov.au",
    agencyId: "c15cb0ae-b6f2-4729-8ed0-289a089a6f72",
  },
];

const { password, name, role } = testUser;
beforeAll(async () => {
  await connection.create();
  const user1 = User.create({
    email: adminEmail,
    password,
    role,
    name,
  });
  user1.verified = true;
  user1.isAdmin = true;
  await user1.save();

  const agency2 = Agency.create({
    name: "agency2222222",
  });
  await agency2.save();
  agency2ID = agency2.id;

  const agency1 = Agency.create({ name: "agency1111" });
  const agencyAdd = await agency1.save();

  agencyID = agencyAdd.id;

  propertyListValidId = [
    {
      ua_id: "UA-123985",
      service_name: "Hello",
      domain: "http://www.xyz.gov.au",
      agencyId: agencyID,
    },
  ];

  propertyListTwoItems = [
    {
      ua_id: "UA-1231985",
      service_name: "Hello",
      domain: "http://www.xyz.gov.au",
      agencyId: agencyID,
    },
    {
      ua_id: "UA-111111",
      service_name: "Design System",
      domain: "http://bla.gov.au",
      agencyId: agencyID,
    },
  ];

  propertyListDuplicateUAID = [
    {
      ua_id: "UA-111111",
      service_name: "Design System",
      domain: "http://duuu.gov.au",
      agencyId: agencyID,
    },
    {
      ua_id: "UA-111111",
      service_name: "Design System",
      domain: "http://duuu.gov.au",
      agencyId: agencyID,
    },
  ];

  const loginResponse = await client.loginAdminUser(adminEmail, password);
  const data = await loginResponse.json();
  accessToken = data.accessToken;
});

afterAll(async () => {
  await connection.close();
});

beforeEach(async () => {
  const manager = getManager();
  await manager.clear(Property);
  await getConnection().getRepository(Property).delete({});
});

describe("Test property crud operations", () => {
  test("Invalid agency", async () => {
    const bodyData = JSON.stringify(propertyListInvalidAgencyId);
    const response = await client.addProperty(accessToken, bodyData);
    const { statusCode, fieldErrors } = await response.json();

    expect(statusCode).toEqual(400);
    expect(fieldErrors[0]).toContain("data was not posted");
  });

  test("Post valid proprety data and test view properties endpoint", async () => {
    const bodyData = JSON.stringify(propertyListValidId);

    const response = await client.addProperty(accessToken, bodyData);
    const { statusCode, message } = await response.json();

    expect(statusCode).toEqual(200);
    expect(message).toContain(propertyListValidId.length);

    const getPropertiesRes = await client.viewProperties(accessToken);

    const getPropsData: any = await getPropertiesRes.json();

    const props: any = await Property.find({ relations: ["agency"] });
    expect(props[0].agency.id).toEqual(agencyID);
  });

  test("Valid data with two agencies", async () => {
    const bodyData = JSON.stringify(propertyListTwoItems);
    const response = await client.addProperty(accessToken, bodyData);
    const { statusCode, message } = await response.json();

    expect(statusCode).toEqual(200);

    expect(message).toContain(propertyListTwoItems.length);

    const getPropertiesRes = await client.viewProperties(accessToken);

    const getPropsData: any = await getPropertiesRes.json();

    const props = await Property.find({ relations: ["agency"] });

    expect(props[0].agency.id).toEqual(agencyID);

    expect(props).toHaveLength(2);
  });

  test("Duplicated UAID throws errror", async () => {
    const bodyData = JSON.stringify(propertyListDuplicateUAID);
    const response = await client.addProperty(accessToken, bodyData);

    const { statusCode, message } = await response.json();

    expect(message).toEqual(
      "You have entered two or more rows that have the same UAID. The UAID must be unique. No data was entered"
    );

    expect(statusCode).toEqual(400);

    const getProperties = await client.viewProperties(accessToken);
    const getPropertiesRes = await getProperties.json();
    console.log("+++++++=");
    console.log("+++++++=");
    console.log(getPropertiesRes);
    console.log("+++++++=");
    console.log("+++++++=");
    const props = await Property.find({ relations: ["agency"] });
    console.log(props);

    expect(getPropertiesRes).toHaveLength(0);
  });

  test("Invalid body data throws error", async () => {
    const bodyData = JSON.stringify(invalidJSON);
    const response = await client.addProperty(accessToken, bodyData);

    const { statusCode, fieldErrors } = await response.json();
    expect(fieldErrors[0]).toContain("ua_id is a required field");
    expect(statusCode).toEqual(400);
    const getProperties = await client.viewProperties(accessToken);

    const getPropertiesRes = await getProperties.json();
    console.log(getPropertiesRes);

    expect(getPropertiesRes).toHaveLength(0);
  });

  // test("Test editing data", async () => {
  //   //Add property
  //   const bodyData = JSON.stringify({
  //     ua_id: "UA-91234",
  //     domain: "domainname.gov.au",
  //     service_name: "hello service",
  //     agencyId: agency2ID,
  //   });
  //   await client.addProperty(accessToken, bodyData);

  //   const getProperties = await client.viewProperties(accessToken);
  //   const getPropertiesRes = await getProperties.json();

  // await client.editProperty(accessToken, getPropertiesRes[0].id, {
  //   ua_id: "UA-1239853",
  //   service_name: "Bye",
  //   domain: "http://www.xyz.gov.au",
  //   agencyId: agency2ID,
  // });

  // const getProperties2 = await client.viewProperties(accessToken);
  // const getPropertiesRes2 = await getProperties2.json();

  // console.log(getPropertiesRes2);
  // });
});