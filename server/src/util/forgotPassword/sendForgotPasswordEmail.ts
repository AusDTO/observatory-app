import { Client } from "@govau-platforms/notify-client";
import { NOTIFY_KEY } from "../constants";
require("dotenv").config();

const notify_client = new Client({
  apiKey: NOTIFY_KEY,
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
