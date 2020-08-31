import Redis from "ioredis";
import { connection } from "../createConnection";
import { User } from "../../entity/User";
import { CreateConfirmationLink } from "./createConfirmationLink";
import node_fetch from "node-fetch";

import { testUser } from "../../util/testData";
import { REDIS_CONFIRMATION_EMAIL_PREFIX } from "../constants";
import * as mockttp from "mockttp";

let userID: string;
const redis_client = new Redis();
const mockServer = mockttp.getLocal();

const { email, password, name, role } = testUser;
beforeAll(async () => {
  await mockServer.start(3000);
  await connection.create();

  const user = User.create({ email, password, name, role });
  await user.save();
  userID = user.id;
});

afterAll(async () => {
  await connection.close();
  await mockServer.stop();
});

describe("Confirmation link", () => {
  it("Returns welcome url when going to confirmation link", async () => {
    const confirmUrl = await CreateConfirmationLink(
      process.env.TEST_HOST_2 as string,
      userID,
      redis_client
    );

    const urlSplit = confirmUrl.split("/");
    const redis_key = urlSplit[urlSplit.length - 1];
    const userid = await redis_client.get(
      `${REDIS_CONFIRMATION_EMAIL_PREFIX}${redis_key}`
    );
    expect(userid).toEqual(userID);

    const response = await node_fetch(confirmUrl);

    const responseUrl = response.url;

    expect(responseUrl).toEqual("http://localhost:3000/welcome");

    //check if redis_key deleted
    const checkDeletedId = await redis_client.get(
      `${REDIS_CONFIRMATION_EMAIL_PREFIX}${redis_key}`
    );
    expect(checkDeletedId).toBeFalsy();
  });

  it("returns invalid url when invalid link passed", async () => {
    const invalidUrl =
      "http://localhost:4000/confirm/be8ef73a-ljk8a5d-4399dfd4920b";
    const response = await node_fetch(invalidUrl);
    const responseUrl = response.url;
    expect(responseUrl).toEqual("http://localhost:3000/invalid-confirmation");
  });
});
