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

export const sendSignUpMessage = async (
  name: string,
  role: string,
  email: string
) => {
  const options: IncomingWebhookSendArguments = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Hi :celebrate:",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "We have had a new sign up to observatoryApp!",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Email*: \n${email}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Role*: \n${role}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Name*: \n ${name}`,
        },
      },
    ],
  };

  if (ENVIRONMENT === "production") {
    await sendSlackMessage(options);
  } else {
    console.log("SENT sign up message");
  }
};
