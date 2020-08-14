import { v4 as uuid } from "uuid";
import { Redis } from "ioredis";
import { FRONT_END_URL, REDIS_FORGOT_PASSWORD_PREFIX } from "../constants";

export const CreateForgotPasswordLink = async (
  userId: string,
  redis: Redis
) => {
  const uniqueId = uuid();
  const timeToExpiry: number = 60 * 30; //30 minutes

  // we will store this unique ID key with the userID being the value of the user
  await redis.set(
    `${REDIS_FORGOT_PASSWORD_PREFIX}${uniqueId}`,
    userId,
    "ex",
    timeToExpiry
  );
  return `${FRONT_END_URL}/reset-password/${uniqueId}`;
};
