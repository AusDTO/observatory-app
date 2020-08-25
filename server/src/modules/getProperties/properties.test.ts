import Redis from "ioredis";
import { User } from "../../entity/User";
import { connection } from "../../util/createConnection";
import { testUser } from "../../util/testData";
import { TestClient } from "../../util/testClient";
import { Agency } from "../../entity/Agency";

const { email, password, name, role } = testUser;
let userID: string;

const client = new TestClient();

let agency; //FIX

beforeAll(async () => {
  await connection.create();
  agency = await Agency.findOne({ where: { name: "DTA" } });

  const user = User.create({
    email,
    password,
    name,
    role,
    agency,
    verified: true,
  });
  await user.save();
  userID = user.id;
});

afterAll(async () => {
  await connection.close();
});

describe("Send forgot password email", () => {
  test("Invalid email", async () => {
    const response = await client.sendForgotPassword("bla@bla.com");
    const { __typename } = response.data.sendForgotPasswordEmail;
    expect(__typename).toEqual("FieldErrors");
  });

  test("User not existing", async () => {
    const response = await client.sendForgotPassword("bla@bla.gov.au");
    const { __typename } = response.data.sendForgotPasswordEmail;
    expect(__typename).toEqual("Error");
  });

  test("User exists", async () => {
    const response = await client.sendForgotPassword(email);
    const { __typename } = response.data.sendForgotPasswordEmail;
    expect(__typename).toEqual("Success");
  });
});
