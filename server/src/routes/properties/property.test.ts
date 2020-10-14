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

  const agency2 = Agency.create({
    name: "agency2222222",
    emailHosts: testAgency.emailHosts,
  });
  await agency2.save();
  agency2ID = agency2.id;

  const agency1 = Agency.create({
    name: "agency1111",
    emailHosts: ["@ato.gov.au"],
  });
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

afterEach(async () => {
  const manager = getManager();
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
      "You have either entered rows with duplicate UAIDs, or are not passing an array of objects"
    );

    expect(statusCode).toEqual(400);

    const getProperties = await client.viewProperties(accessToken);
    const getPropertiesRes = await getProperties.json();
    const props = await Property.find({ relations: ["agency"] });

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

    expect(getPropertiesRes).toHaveLength(0);
  });

  test("Test editing data", async () => {
    //Add property
    const bodyData = JSON.stringify([
      {
        ua_id: "UA-91234",
        domain: "domainname.gov.au",
        service_name: "hello service",
        agencyId: agency2ID,
      },
    ]);
    await client.addProperty(accessToken, bodyData);

    const getProperties = await client.viewProperties(accessToken);
    const getPropertiesRes = await getProperties.text();

    const props = await Property.find({ relations: ["agency"] });
    const propertyId = props[0].ua_id;

    const editData = JSON.stringify({
      service_name: "Bye",
      domain: "http://www.xyz.gov.au",
    });

    const res = await client.editProperty(accessToken, propertyId, editData);
    const { statusCode } = await res.json();
    expect(statusCode).toEqual(200);
    const getProperties2 = await client.viewProperties(accessToken);
    const getPropertiesRes2 = await getProperties2.json();

    const { ua_id, service_name } = getPropertiesRes2[0];

    expect(ua_id).toEqual("UA-91234");
    expect(service_name).toEqual("Bye");
  });

  test("Test editing data invalid property", async () => {
    //Add property
    const bodyData = JSON.stringify([
      {
        ua_id: "UA-91234",
        domain: "domainname.gov.au",
        service_name: "hello service",
        agencyId: agency2ID,
      },
    ]);
    await client.addProperty(accessToken, bodyData);

    const getProperties = await client.viewProperties(accessToken);
    const getPropertiesRes = await getProperties.text();

    const props = await Property.find({ relations: ["agency"] });
    const propertyId = props[0].ua_id;

    const editData = JSON.stringify({
      service_name: "Bye",
      domain: "http://www.xyz.gov.au",
    });

    const res = await client.editProperty(
      accessToken,
      "UA-123123123123123",
      editData
    );
    const { statusCode } = await res.json();
    expect(statusCode).toEqual(404);
  });

  test("Test editing data invalid agency", async () => {
    //Add property
    const bodyData = JSON.stringify([
      {
        ua_id: "UA-91234",
        domain: "domainname.gov.au",
        service_name: "hello service",
        agencyId: agency2ID,
      },
    ]);
    await client.addProperty(accessToken, bodyData);

    const getProperties = await client.viewProperties(accessToken);
    const getPropertiesRes = await getProperties.text();

    const props = await Property.find({ relations: ["agency"] });
    const propertyId = props[0].ua_id;

    const editData = JSON.stringify({
      service_name: "Bye",
      domain: "http://www.xyz.gov.au",
      agencyId: "2ffbde1c-e63e-45fe-9971-79705b06d604",
    });

    const res = await client.editProperty(accessToken, propertyId, editData);
    const { statusCode } = await res.json();
    expect(statusCode).toEqual(400);
  });

  test("Test editing data invalid service name", async () => {
    //Add property
    const bodyData = JSON.stringify([
      {
        ua_id: "UA-91234",
        domain: "domainname.gov.au",
        service_name: "Bla",
        agencyId: agency2ID,
      },
    ]);
    await client.addProperty(accessToken, bodyData);

    const getProperties = await client.viewProperties(accessToken);
    const getPropertiesRes = await getProperties.text();

    const props = await Property.find({ relations: ["agency"] });
    const propertyId = props[0].ua_id;

    const editData = JSON.stringify({
      service_name: "",
      domain: "http://www.xyz.gov.au",
      agencyId: "2ffbde1c-e63e-45fe-9971-79705b06d604",
    });

    const res = await client.editProperty(accessToken, propertyId, editData);
    const { statusCode } = await res.json();
    expect(statusCode).toEqual(400);
  });
});
