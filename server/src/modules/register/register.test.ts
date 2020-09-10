import { User } from "../../entity/User";
import { request } from "graphql-request";

import { connection } from "../../util/createConnection";
import { testUser, testAgency } from "../../util/testData";
import { TestClient } from "../../util/testClient";
import { Agency } from "../../entity/Agency";
import { getConnection } from "typeorm";

const { email, password, name, role } = testUser;
const client = new TestClient();

beforeAll(async () => {
  await connection.create();
});

afterAll(async () => {
  await getConnection().getRepository(User).delete({});
  await getConnection().getRepository(Agency).delete({});
  await connection.close();
});

describe("Register a new user", () => {
  test("Register new user valid data", async () => {
    const result = await client.register(email, password, name, role);

    const { register } = result;
    expect(register.__typename).toEqual("UserRegistered");

    const users = await User.find({ where: { email } });
    expect(password).not.toEqual(users[0].password);

    expect(users).toHaveLength(1);
  });

  test("Can't create dupe user", async () => {
    const result = await client.register(email, password, name, role);

    const { register } = result;
    expect(register.__typename).toEqual("UserAlreadyExistsError");
  });

  test("Register invalid email", async () => {
    const result = await client.register("bla", password, name, role);

    const { register } = result;
    expect(register.__typename).toEqual("FieldErrors");

    // There should only be one error since password is valid
    const { errors } = register;
    expect(errors).toHaveLength(2);

    expect(errors[0].path).toEqual("email");
  });

  test("Register non gov.au email", async () => {
    const result = await client.register("bla@bla.com", password, name, role);

    const { register } = result;
    expect(register.__typename).toEqual("FieldErrors");

    // There should only be one error since password is valid
    const { errors } = register;
    expect(errors).toHaveLength(1);

    expect(errors[0].path).toEqual("email");
  });

  test("Register invalid password", async () => {
    const result = await client.register(email, "3", name, role);

    const { register } = result;
    expect(register.__typename).toEqual("FieldErrors");

    // There should only be one error since email is valid
    const { errors } = register;
    expect(errors).toHaveLength(1);

    expect(errors[0].path).toEqual("password");
  });

  test("Register invalid password and invalid email", async () => {
    const result = await client.register("bla", "bla", name, role);

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

  test("Test blank role", async () => {
    const result = await client.register(email, password, name, "");

    const { register } = result;
    expect(register.__typename).toEqual("FieldErrors");

    // There should only be one error since email is valid
    const { errors } = register;
    expect(errors).toHaveLength(2);

    expect(errors[0].path).toEqual("role");
  });

  test("Automatically adding agency to email domain works", async () => {
    const testEmail = "abc@dta.gov.au";
    const agency1 = Agency.create({
      name: testAgency.name,
      emailHosts: testAgency.emailHosts,
    });
    await agency1.save();
    const agency1Id = agency1.id;

    const result = await client.register(testEmail, password, name, role);

    const { register } = result;
    expect(register.__typename).toEqual("UserRegistered");

    const getUser = await User.findOne({
      where: { email: testEmail },
      relations: ["agency"],
    });

    expect(getUser?.agency.id).toEqual(agency1Id);
    expect(getUser?.agency.name).toEqual(agency1.name);
  });
});
