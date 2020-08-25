import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import { createMiddleware } from "../../util/createMiddleware";
import middleware from "./middleware";

export const resolvers: ResolverMap = {
  Query: {
    getUser: createMiddleware(middleware, async (_, __, { session }) => {
      const user = await User.findOne({ where: { id: session.userId } });
      return user;
    }),
  },
};
