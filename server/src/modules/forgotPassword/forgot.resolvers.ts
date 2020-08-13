import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import {
  IForgotPasswordSendEmailType,
  IResetPasswordType,
} from "../../types/schema";
import { removeSessions } from "../../util/removeAllUserSessions";
import { CreateForgotPasswordLink } from "../../util/forgotPassword/createForgotPasswordLink";
import { sendForgotPasswordEmail } from "../../util/forgotPassword/sendForgotPasswordEmail";
import { REDIS_FORGOT_PREFIX } from "../../util/constants";
import * as yup from "yup";
import { formatYupError } from "../../util/formatYupError";

const forgotPasswordEmailValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter an email")
    .required()
    .max(255)
    .matches(/.gov.au$/, "Only government emails are allowed to apply"),
});

const resetPasswordValidationSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Enter a password")
    .max(255)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
    ),
  key: yup.string().required("Invalid"),
});

export const resolvers: ResolverMap = {
  Query: {
    random: async (parent, args, { redis_client, url }) => {
      return "hello";
    },
  },
  Mutation: {
    sendForgotPasswordEmail: async (
      parent: any,
      args: IForgotPasswordSendEmailType,
      { redis_client }
    ) => {
      try {
        await forgotPasswordEmailValidationSchema.validate(args, {
          abortEarly: false,
        });
      } catch (errors) {
        return {
          __typename: "FieldErrors",
          errors: formatYupError(errors),
        };
      }

      const { email } = args;

      const user = await User.findOne({
        where: { email },
        select: ["id", "name"],
      });

      //enters a user that does not exist
      if (!user) {
        return {
          __typename: "Error",
          message: "If email exists, we have sent a resent link.",
        };
      }

      //remove sessions for the user: i.e. log them out
      removeSessions(user.id, redis_client);

      //create forgotpassword link
      const forgotLink = await CreateForgotPasswordLink(user.id, redis_client);

      //send forgot password email
      await sendForgotPasswordEmail(email, user.name, forgotLink);

      return {
        __typename: "Success",
        message: "If email exists, we have sent a resent link.",
      };
    },

    resetPassword: async (
      _,
      { newPassword, key }: IResetPasswordType,
      { redis_client }
    ) => {
      //get user id
      const userId = await redis_client.get(`${REDIS_FORGOT_PREFIX}${key}`);

      if (!userId) {
        return {
          __typename: "Error",
          message: "Not found",
        };
      }

      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        return {
          __typename: "Error",
          message: "Not found",
        };
      }

      //update password
      await User.update({ id: user.id }, { password: newPassword });
      return {
        __typeName: "Success",
        message: "Password changed successfully",
      };
    },
  },
};
