import { BigQuery } from "@google-cloud/bigquery";

require("dotenv").config();
var cfenv = require("cfenv");
let appEnv: any;

//FIX FILE use 'lets'

export const ENVIRONMENT = process.env.NODE_ENV;
export const FRONT_END_URL =
  ENVIRONMENT !== "production"
    ? "http://localhost:3000"
    : "https://observatory-app.apps.y.cld.gov.au";

export const CORS_OPTIONS =
  ENVIRONMENT === "production" ? "same-origin" : FRONT_END_URL;

export const RESOLVER_FILE_TYPE = ENVIRONMENT === "production" ? "js" : "ts";
export const REDIS_PREFIX = "sess:";
export const USER_SESSION_PREFIX = "userSessionID:";

export const REDIS_FORGOT_PASSWORD_PREFIX = "forgotPassword:";
export const REDIS_CONFIRMATION_EMAIL_PREFIX = "confirmEmail:";
export const REDIS_PEAK_TS_PREFIX = "peakdata:";

export const basicApiErrorMessage = (message: string, path: string) => ({
  __typename: "Error",
  message,
  path,
});

export const basicApiMessage = (__typename: string, message: string) => ({
  __typename,
  message,
});

if (ENVIRONMENT == "production") {
  appEnv = cfenv.getAppEnv();
}

const notify_key = () => {
  if (ENVIRONMENT === "test") {
    return process.env.NOTIFY_TEST_KEY;
  }
  if (ENVIRONMENT === "development") return process.env.NOTIFY_TEST_KEY;
  if (ENVIRONMENT === "production")
    return appEnv.services["user-provided"][0].credentials.NOTIFY_LIVE_KEY;
};

export const NOTIFY_KEY = notify_key();

export const JWT_SECRET =
  ENVIRONMENT === "production"
    ? appEnv.services["user-provided"][0].credentials.JWT_SECRET
    : "SECRETKEY";

export let sessionSecret = "SecretKey";
if (ENVIRONMENT === "production") {
  appEnv = cfenv.getAppEnv();
  sessionSecret =
    appEnv.services["user-provided"][0].credentials.SESSION_SECRET;
}

export const ADMIN_EMAILS: Array<String> =
  ENVIRONMENT === "production"
    ? appEnv.services["user-provided"][0].credentials.ADMIN_EMAILS
    : ["sukhraj.ghuman@digital.gov.au", "bla@dta.gov.au"];

export const swaggerOptions = {
  customCss: `h4,p,span,code,.tablinks{font-size:1.3rem!important}a{text-decoration:underline;color:#00698f}.btn.try-out__btn{display:none}.opblock-tag a span{text-decoration:underline;font-size:1.4rem!important}a{color:#00698f!important;text-decoration:underline}a:hover{text-decoration:none}table{font-size: 1rem;}
      `,
};

export const SLACK_WEBHOOK_URL =
  ENVIRONMENT === "production"
    ? appEnv.services["user-provided"][0].credentials.SLACK_WEBHOOK_URL
    : "process.env.SLACK_WEBHOOK_URL";

export const bigQuery =
  ENVIRONMENT !== "production"
    ? new BigQuery({
        credentials: {
          client_email: process.env.BIGQUERY_EMAIL,
          private_key: (process.env.BIGQUERY_PRIVATE_KEY as string).replace(
            /\\n/gm,
            "\n"
          ),
        },
        projectId: "dta-ga-bigquery",
      })
    : new BigQuery({
        credentials: {
          client_email:
            appEnv.services["user-provided"][0].credentials.BIGQUERY_EMAIL,
          private_key:
            appEnv.services["user-provided"][0].credentials
              .BIGQUERY_PRIVATE_KEY,
        },
        projectId: "dta-ga-bigquery",
      });
