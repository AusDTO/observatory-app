import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import * as bcrypt from "bcrypt";
import { IUserType } from "../../types/schema";
import {
  USER_SESSION_PREFIX,
  basicApiErrorMessage,
  basicApiMessage,
} from "../../util/constants";
import * as yup from "yup";
import { emailValidator, passwordValidator } from "../../util/yup";
import { formatYupError } from "../../util/formatYupError";

const loginValidationSchema = yup.object().shape({
  email: emailValidator,
  password: passwordValidator,
});

export const resolvers: ResolverMap = {
  Query: {
    bye2: async (parent, args, { redis_client, url }) => {
      return "hello";
    },
  },
  Mutation: {
    login: async (__: any, args: IUserType, { session, redis_client, req }) => {
      try {
        await loginValidationSchema.validate(args, { abortEarly: false });
      } catch (errors) {
        return {
          __typename: "FieldErrors",
          errors: formatYupError(errors),
        };
      }

      const { email, password } = args;
      const user = await User.findOne({
        where: { email },
        relations: ["agency"],
      });

      if (!user) {
        return basicApiErrorMessage("Email or password is invalid", "error");
      }

      //compare password to db
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return basicApiErrorMessage("Email or password is invalid", "error");
      }

      if (!user.verified) {
        return basicApiErrorMessage(
          "Please check your email for a confirmation link. We need to verify you as a user.",
          "error"
        );
      }

      //express-session will store this in a cookie
      session.userId = user.id;
      if (user.agency) {
        session.agencyId = user.agency.id;
      }

      //add this session to the userID
      if (req.sessionID) {
        //add prefix so its easier to see keys in redis
        //store all sessions of the user
        await redis_client.lpush(
          `${USER_SESSION_PREFIX}${user.id}`,
          req.sessionID
        );
      }

      return basicApiMessage("Success", "Login succeeded");
    },
  },
};
