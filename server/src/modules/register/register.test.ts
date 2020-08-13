import { User } from "../../entity/User";
import { request } from "graphql-request";

import { connection } from "../../util/createConnection";
import { testData } from "../../util/testData";
import { TestClient } from "../../util/testClient";

const { email, password, name, agency, role } = testData;
const client = new TestClient();

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await connection.close();
});

describe("Register a new user", () => {
  test("Register new user", async () => {
    const result = await client.register(email, password, name, agency, role);

    const { register } = result;
    expect(register.__typename).toEqual("UserRegistered");

    const users = await User.find({ where: { email } });
    expect(password).not.toEqual(users[0].password);

    expect(users).toHaveLength(1);
  });

  test("Can't create dupe user", async () => {
    const result = await client.register(email, password, name, agency, role);

    const { register } = result;
    expect(register.__typename).toEqual("UserAlreadyExistsError");
  });

  test("Register invalid email", async () => {
    const result = await client.register("bla", password, name, agency, role);

    const { register } = result;
    expect(register.__typename).toEqual("FieldErrors");

    // There should only be one error since password is valid
    const { errors } = register;
    expect(errors).toHaveLength(2);

    expect(errors[0].path).toEqual("email");
  });

  test("Register non gov.au email", async () => {
    const result = await client.register(
      "bla@bla.com",
      password,
      name,
      agency,
      role
    );

    const { register } = result;
    expect(register.__typename).toEqual("FieldErrors");

    // There should only be one error since password is valid
    const { errors } = register;
    expect(errors).toHaveLength(1);

    expect(errors[0].path).toEqual("email");
  });

  test("Register invalid password", async () => {
    const result = await client.register(email, "3", name, agency, role);

    const { register } = result;
    expect(register.__typename).toEqual("FieldErrors");

    // There should only be one error since email is valid
    const { errors } = register;
    expect(errors).toHaveLength(1);

    expect(errors[0].path).toEqual("password");
  });

  test("Register invalid password and invalid email", async () => {
    const result = await client.register("bla", "bla", name, agency, role);

    const { register } = result;
    expect(register.__typename).toEqual("FieldErrors");

    const { errors } = register;
    expect(errors).toHaveLength(3);
  });
});

describe("Confirmation email", () => {
  test("Verified is false when initially creating ", async () => {
    const users = await User.findOne({
      where: { email },
      select: ["verified", "id"],
    });

    expect(users?.verified).toBeFalsy();
  });

  test("Resend confirmation link", async () => {
    const result = await client.resendConfrimation(email);

    const { resendConfirmationEmail } = result;

    expect(resendConfirmationEmail.__typename).toEqual("ConfirmationEmailSent");
  });

  test("Test blank agency", async () => {
    const result = await client.register(email, password, name, "s", role);

    const { register } = result;
    expect(register.__typename).toEqual("FieldErrors");

    // There should only be one error since email is valid
    const { errors } = register;
    expect(errors).toHaveLength(1);

    expect(errors[0].path).toEqual("agency");
  });
});
