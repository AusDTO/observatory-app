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
    bye2: async (parent, args, { redis_client, url }) => {
      return "hello";
    },
    me: createMiddleware(
      middleware,
      async (_, __, { session }) =>
        await User.findOne({ where: { id: session.userId } })
    ),
  },
  Mutation: {
    login: async (parent: any, { email, password }: IUserType, { session }) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return ErrorMessage("Invalid credentials");
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return ErrorMessage("Invalid credentials");
      }

      if (!user.verified) {
        return ErrorMessage(
          "Please check your email for a confirmation link. We need to verify you as a user."
        );
      }

      //express-session will store this in a cookie
      session.userId = user.id;

      return {
        __typename: "Success",
        message: "Login succeeded",
      };
    },
  },
};
