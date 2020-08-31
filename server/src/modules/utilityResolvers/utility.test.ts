import Redis from "ioredis";
import { connection } from "../../util/createConnection";
import { TestClient } from "../../util/testClient";
import { CreateForgotPasswordLink } from "../../util/forgotPassword/createForgotPasswordLink";

const client = new TestClient();
const redis_client = new Redis();

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.close();
});

describe("Check key", () => {
  test("invalid key", async () => {
    const result = await client.isResetLinkValid("asfasfasfa");
    const { isResetLinkValid } = result.data;
    // expect(isResetLinkValid).toBeFalsy();
  });
  // test("valid key", async () => {
  //   const fakeUserID = "3475686efgve67rt89768r75e";
  //   const resetPasswordLink = await CreateForgotPasswordLink(
  //     fakeUserID,
  //     redis_client
  //   );
  //   const splitLink = resetPasswordLink.split("/");
  //   const key = splitLink[splitLink.length - 1];
  //   const result = await client.isResetLinkValid(key);
  //   const { isResetLinkValid } = result.data;
  //   expect(isResetLinkValid).toEqual(true);
  // });
});
