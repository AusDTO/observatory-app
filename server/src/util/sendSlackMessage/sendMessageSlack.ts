import { IncomingWebhook, IncomingWebhookSendArguments } from "@slack/webhook";
import { ENVIRONMENT, SLACK_WEBHOOK_URL } from "../constants";

const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

export const sendSlackMessage = async (
  options: IncomingWebhookSendArguments
) => {
  await webhook.send({ ...options });
};

export const sendFeedbackMessage = async (
  pageUrl: string,
  pageTitle: string,
  feedback: string
) => {
  const options: IncomingWebhookSendArguments = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Hi :wave:",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "We have received some feedback on the observatory app",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Feedback*: \n${feedback}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Page path*: \n${pageUrl}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Page title*: \n ${pageTitle}`,
        },
      },
    ],
  };

  if (ENVIRONMENT === "production") {
    await sendSlackMessage(options);
  } else {
    console.log("SENT feedback");
  }
};
