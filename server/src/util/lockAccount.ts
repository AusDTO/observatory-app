import { Redis } from "ioredis";
import { removeSessions } from "./removeAllUserSessions";

export const lockAccount = async (userId: string, redis_client: Redis) => {
  // can't login
  // await User.update({ id: userId });

  await removeSessions(userId, redis_client);
};
