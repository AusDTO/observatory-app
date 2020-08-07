import { Client } from "@govau-platforms/notify-client";
require("dotenv").config();
// const apiKey: string =
//   process.env.NODE_ENV === "test"
//     ? (process.env.NOTIFY_TEST_KEY as string)
//     : (process.env.NOTIFY_DEV_KEY as string);

const apiKey = process.env.NOTIFY_TEST_KEY as string;
const notify_client = new Client({
  apiKey,
});

export const sendConfirmationEmail = async (
  emailAddress: string,
  name: string,
  confirm_url: string
) => {
  const templateId = "47112fdc-4e78-47de-9f63-d3b66d677306";

  await notify_client.sendEmail(templateId, emailAddress, {
    personalisation: {
      confirm_url,
      name,
    },
  });
};
