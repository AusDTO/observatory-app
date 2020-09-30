import { User } from "../../entity/User";
import { connection } from "../../util/createConnection";
import { testUser } from "../../util/testData";
import { TestClient } from "../../util/testClient";
import { getConnection } from "typeorm";

const { email, password, name, role, emailHost } = testUser;

const pageTitle = "home";
const pageUrl = "observatory.apps.y.cld.gov.au";
const feedback = "Great website";

const client = new TestClient();

beforeAll(async () => {
  await connection.create();
  const user1 = User.create({
    email,
    password,
    name,
    role,
    emailHost,
    verified: true,
  });

  await user1.save();
});

afterAll(async () => {
  await getConnection().getRepository(User).delete({});

  await connection.close();
});

describe("Test sending feedback", () => {
  test("Not logged in", async () => {
    const result = await client.sendFeedbackData(pageTitle, pageUrl, feedback);
    const { __typename } = result.data.sendFeedback;

    expect(__typename).toEqual("Error");
  });

  test("Logged in", async () => {
    await client.login(email, password);

    const result = await client.sendFeedbackData(pageTitle, pageUrl, feedback);
    const { __typename } = result.data.sendFeedback;

    expect(__typename).toEqual("Success");
  });

  test("Test invalid feedback field", async () => {
    await client.login(email, password);

    const result = await client.sendFeedbackData(pageTitle, pageUrl, "");
    const { __typename } = result.data.sendFeedback;

    expect(__typename).toEqual("FieldErrors");
  });

  test("Test invalid feedback & pageUrl field", async () => {
    await client.login(email, password);

    const result = await client.sendFeedbackData(pageTitle, "", "");
    const { __typename } = result.data.sendFeedback;

    expect(__typename).toEqual("FieldErrors");
  });
});
