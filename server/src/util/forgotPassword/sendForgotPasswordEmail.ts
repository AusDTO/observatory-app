import { Client } from "@govau-platforms/notify-client";
require("dotenv").config();
const apiKey: string =
  process.env.NODE_ENV === "test"
    ? (process.env.NOTIFY_TEST_KEY as string)
    : (process.env.NOTIFY_DEV_KEY as string);

// const apiKey = process.env.NOTIFY_TEST_KEY as string;
const notify_client = new Client({
  apiKey,
});

export const sendForgotPasswordEmail = async (
  emailAddress: string,
  name: string,
  forgot_password_url: string
) => {
  const templateId = "6a47a38f-3024-41f6-a09f-e44abb140b12";

  await notify_client.sendEmail(templateId, emailAddress, {
    personalisation: {
      forgot_password_url,
      name,
    },
  });
};
