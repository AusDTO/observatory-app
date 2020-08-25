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
    await client.login(email, password);

    const res = await client.getProperties();

    // console.log(res);
  });
});
