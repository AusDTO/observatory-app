import { v4 as uuid } from "uuid";
import { Redis } from "ioredis";

// stores redis key value of id: userID
// returns express server endpoint SERVER_URL/confirm/:id
// when link clicked, the link is invalidated and user is verified.
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
