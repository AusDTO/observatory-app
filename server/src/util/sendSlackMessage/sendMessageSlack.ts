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
          text: `*Feedback*: \n${feedback.trim()}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Page path*: \n${pageUrl.trim()}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Page title*: \n ${pageTitle.trim()}`,
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
          text: `*Email*: \n${email.trim()}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Role*: \n${role.trim()}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Name*: \n ${name.trim()}`,
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

export const sendURLEngagementMessage = async (
  url: string,
  dateType: string
) => {
  const options: IncomingWebhookSendArguments = {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "A request has been made to Knowledge Product 2!",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*URL:* ${url.trim()}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Time period:* ${dateType.trim()}`,
        },
      },
    ],
  };

  if (ENVIRONMENT === "production") {
    await sendSlackMessage(options);
  } else {
    console.log("SENT URL Engagement Request");
  }
};
