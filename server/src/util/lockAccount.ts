import { Redis } from "ioredis";
import { User } from "../entity/User";
import { removeSessions } from "./removeAllUserSessions";

export const lockAccount = async (userId: string, redis_client: Redis) => {
  // can't login
  await User.update({ id: userId }, { locked: true });

  await removeSessions(userId, redis_client);
};
