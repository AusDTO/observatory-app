import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import { IUserType } from "../../types/schema";
import { USER_SESSION_PREFIX, REDIS_PREFIX } from "../../util/constants";
import { removeSessions } from "../../util/removeAllUserSessions";

const ErrorMessage = (message: string) => ({
  __typename: "Error",
  message,
});

export const resolvers: ResolverMap = {
  Query: {
    dummy: async (parent, args, { redis_client, url }) => {
      return "hello";
    },
  },
  Mutation: {
    logout: async (_, __, { session, redis_client }) => {
      const { userId } = session;
      if (userId) {
        //remove all sessions associated with this userId
        await removeSessions(userId, redis_client);
        return true;
      } else return false;
    },
  },
};
