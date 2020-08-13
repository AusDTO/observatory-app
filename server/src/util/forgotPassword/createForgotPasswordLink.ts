import { v4 as uuid } from "uuid";
import { Redis } from "ioredis";
import { FRONT_END_URL, REDIS_FORGOT_PREFIX } from "../constants";

export const CreateForgotPasswordLink = async (
  userId: string,
  redis: Redis
) => {
  const id = uuid();
  const timeToExpiry: number = 60 * 30; //30 minutes
  //
  await redis.set(`${REDIS_FORGOT_PREFIX}${id}`, userId, "ex", timeToExpiry);
  return `${FRONT_END_URL}/change-password/${id}`;
};
