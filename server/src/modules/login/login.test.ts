import { User } from "../../entity/User";
import { request } from "graphql-request";

import { connection } from "../../util/createConnection";

import { testData } from "../../util/testData";

const { email, password, name, agency, role } = testData;

beforeAll(async () => {
  await connection.create();
  await request(
    process.env.TEST_HOST as string,
    registerMutation(email, password, name, agency, role)
  );
});

afterAll(async () => {
  await connection.close();
});

const registerMutation = (
  e: string,
  p: string,
  n: string,
  a: string,
  r: string
) => `
    mutation {
        register(email: "${e}", password: "${p}", name:"${n}", agency:"${a}", role: "${r}") {
          __typename
          ... on UserRegistered {
            message
          }
        }
      }`;

const loginMutation = (e: string, p: string) => `mutation {
    login(email: "${e}", password:"${p}"){
      __typename
      ...on Error {
        message
      }
      ...on Success {
        message
      }
    }
  }`;

describe("Login user", () => {
  test("Without being verified", async () => {
    const result = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );

    const { login } = result;
    const { message } = login;
    expect(login.__typename).toEqual("Error");
    expect(message).toContain("check your email for a confirmation link");
  });

  test("Test login with verified user", async () => {
    //first verify the user
    await User.update({ email }, { verified: true });
    const result = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, password)
    );

    const { login } = result;
    const { message } = login;

    expect(login.__typename).toEqual("Success");
    expect(message).toEqual("Login succeeded");
  });

  test("Test invalid credentials", async () => {
    const result = await request(
      process.env.TEST_HOST as string,
      loginMutation(email, "wrong_password")
    );
    const { login } = result;
    const { message } = login;
    expect(login.__typename).toEqual("Error");
    expect(message).toEqual("Invalid credentials");
  });
});
