export const ENVIRONMENT = process.env.NODE_ENV;
export const FRONT_END_URL =
  ENVIRONMENT === "development" || "test" ? "http://localhost:3000" : "URL";

export const REDIS_PREFIX = "sess:";
export const USER_SESSION_PREFIX = "userSessionID:";

export const REDIS_FORGOT_PREFIX = "forgotPassword:";
