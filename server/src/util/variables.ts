export const ENVIRONMENT = process.env.NODE_ENV;
export const FRONT_END_URL =
  ENVIRONMENT === "development" || "test" ? "http://localhost:3000" : "URL";
