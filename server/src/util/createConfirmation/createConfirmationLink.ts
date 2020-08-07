import { v4 as uuid } from "uuid";
import { Redis } from "ioredis";

export const CreateConfirmationLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = uuid();
  //Redis takes seconds, this gets seconds in the last 24 hours.
  const timeToExpiry: number = 60 * 60 * 24;
  await redis.set(id, userId, "ex", timeToExpiry);
  return `${url}/confirm/${id}`;
};
