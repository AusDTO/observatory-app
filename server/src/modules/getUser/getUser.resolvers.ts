import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import * as bcrypt from "bcrypt";
import { IUserType } from "../../types/schema";
import { createMiddleware } from "../../util/createMiddleware";
import middleware from "./middleware";

const ErrorMessage = (message: string) => ({
  __typename: "Error",
  message,
});

export const resolvers: ResolverMap = {
  Query: {
    getUser: createMiddleware(
      middleware,
      async (_, __, { session }) =>
        await User.findOne({ where: { id: session.userId } })
    ),
  },
};
