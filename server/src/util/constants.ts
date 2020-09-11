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
  customCss: `h4,p,span,.tablinks{font-size:1.3rem!important}a{text-decoration:underline;color:#00698f}.btn.try-out__btn{display:none}.opblock-tag a span{text-decoration:underline;font-size:1.4rem!important}a{color:#00698f!important;text-decoration:underline}a:hover{text-decoration:none}
      `,
};
