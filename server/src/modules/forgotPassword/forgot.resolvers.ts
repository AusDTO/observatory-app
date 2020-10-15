import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import {
  IForgotPasswordSendEmailType,
  IResetPasswordType,
} from "../../types/schema";
import { removeSessions } from "../../util/removeAllUserSessions";
import { CreateForgotPasswordLink } from "../../util/forgotPassword/createForgotPasswordLink";
import { sendForgotPasswordEmail } from "../../util/forgotPassword/sendForgotPasswordEmail";
import {
  REDIS_FORGOT_PASSWORD_PREFIX,
  basicApiErrorMessage,
  basicApiMessage,
  ENVIRONMENT,
} from "../../util/constants";
import * as yup from "yup";
import * as bcrypt from "bcryptjs";
import { formatYupError } from "../../util/formatYupError";
import { emailValidator, passwordValidator } from "../../util/yup";

const forgotPasswordEmailValidationSchema = yup.object().shape({
  email: emailValidator,
});

const resetPasswordValidationSchema = yup.object().shape({
  newPassword: passwordValidator,
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
        return basicApiErrorMessage(
          "If email exists, we have sent a resent link.",
          "email"
        );
      }

      //remove sessions for the user: i.e. log them out
      removeSessions(user.id, redis_client);

      //create forgotpassword link
      const forgotLink = await CreateForgotPasswordLink(user.id, redis_client);

      if (ENVIRONMENT === "development") {
        console.log(forgotLink);
      }

      await sendForgotPasswordEmail(email, user.name, forgotLink);

      return basicApiMessage(
        "Success",
        "If email exists, we have sent a resent link."
      );
    },

    //post to this resolver from FRONT_END_URL/reset-password/key
    resetPassword: async (_, args: IResetPasswordType, { redis_client }) => {
      try {
        await resetPasswordValidationSchema.validate(args, {
          abortEarly: false,
        });
      } catch (errors) {
        return {
          __typename: "FieldErrors",
          errors: formatYupError(errors),
        };
      }
      const { newPassword, key } = args;

      //get user id
      const userId = await redis_client.get(
        `${REDIS_FORGOT_PASSWORD_PREFIX}${key}`
      );

      if (!userId) {
        return basicApiErrorMessage(
          "Expired or invalid password link",
          "Error"
        );
      }

      const user = await User.findOne({ where: { id: userId } });

      if (!user) {
        return basicApiErrorMessage("User not found", "Error");
      }

      //Have to hash since @beforeUpdate doesn't work for some reason
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      await User.update({ id: user.id }, { password: hashedPassword }); // Update password

      await redis_client.del(`${REDIS_FORGOT_PASSWORD_PREFIX}${key}`); // delete key

      return basicApiMessage("Success", "Password changed successfuly");
    },
  },
};
