import { Redis } from "ioredis";
import { USER_SESSION_PREFIX, REDIS_PREFIX } from "./constants";

export const removeSessions = async (userId: string, redis_client: Redis) => {
  // get all sessions for the user
  const sessions = await redis_client.lrange(
    `${USER_SESSION_PREFIX}${userId}`,
    0,
    -1
  );

  sessions.forEach(
    async (id: string) => await redis_client.del(`${REDIS_PREFIX}${id}`)
  );

  //delete key list of all sessions
  await redis_client.del(`${USER_SESSION_PREFIX}${userId}`);
};
