import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import * as bcrypt from "bcrypt";
import { IUserType } from "../../types/schema";
import { USER_SESSION_PREFIX } from "../../util/constants";

const ErrorMessage = (message: string) => ({
  __typename: "Error",
  message,
});

export const resolvers: ResolverMap = {
  Query: {
    bye2: async (parent, args, { redis_client, url }) => {
      return "hello";
    },
  },
  Mutation: {
    login: async (
      parent: any,
      { email, password }: IUserType,
      { session, redis_client, req }
    ) => {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return ErrorMessage("Invalid credentials");
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return ErrorMessage("Invalid credentials");
      }

      if (user.locked) {
        return ErrorMessage("Your account has been locked");
      }

      if (!user.verified) {
        return ErrorMessage(
          "Please check your email for a confirmation link. We need to verify you as a user."
        );
      }

      //express-session will store this in a cookie
      session.userId = user.id;

      console.log(req.sessionID);

      //add this session to the userID
      if (req.sessionID) {
        await redis_client.lpush(
          `${USER_SESSION_PREFIX}${user.id}`,
          req.sessionID
        );
      }
      //store all sessions of the user
      // await redis_client.lpush(userid, )

      return {
        __typename: "Success",
        message: "Login succeeded",
      };
    },
  },
};
