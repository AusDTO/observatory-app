export const ENVIRONMENT = process.env.NODE_ENV;
export const FRONT_END_URL =
  ENVIRONMENT === "development" || "test"
    ? "http://localhost:3000"
    : "http://localhost:3000";

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
