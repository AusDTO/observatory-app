import { IUserType, IResendConfirmation } from "../../types/schema";
import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import * as yup from "yup";
import { formatYupError } from "../../util/formatYupError";
import { CreateConfirmationLink } from "../../util/createConfirmation/createConfirmationLink";
import { sendConfirmationEmail } from "../../util/sendConfirmationEmail/sendEmail";
import { emailValidator, passwordValidator } from "../../util/yup";
import { basicApiMessage, ENVIRONMENT } from "../../util/constants";
import { Agency } from "../../entity/Agency";
import {
  getAgencyCodeFromEmail,
  getEmailHost,
} from "../../util/getAgencyCodeFromEmail";
import { getManager, getRepository } from "typeorm";
import { sendSignUpMessage } from "../../util/sendSlackMessage/sendMessageSlack";

const validationSchema = yup.object().shape({
  email: emailValidator,
  password: passwordValidator,
  name: yup.string().required().min(2),
  role: yup.string().required().min(2),
});

const resendValidationSchema = yup.object().shape({
  email: emailValidator,
});

export const resolvers: ResolverMap = {
  Query: {
    bye: () => {
      return "hello";
    },
  },
  Mutation: {
    register: async (__, args: IUserType, { redis_client, url }) => {
      try {
        await validationSchema.validate(args, { abortEarly: false });
      } catch (errors) {
        return {
          __typename: "FieldErrors",
          errors: formatYupError(errors),
        };
      }

      const { email, password, name, role } = args;

      //try to find a user with passed in email
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["email", "verified"],
      });

      if (userAlreadyExists && !userAlreadyExists.verified) {
        return {
          __typename: "UserAlreadyExistsError",
          message: `The user has been created, but the email is yet to be verified. Please check ${userAlreadyExists.email} for a confirmation link`,
          path: "email",
        };
      }

      if (userAlreadyExists) {
        return {
          __typename: "UserAlreadyExistsError",
          message: `The user with email ${email} already exists`,
          path: "email",
        };
      }

      const emailHost = getEmailHost(email);

      //password is hashed in database in the beforeUpdate() function
      const user = User.create({ email, password, name, role, emailHost });

      //find associated agency
      const agency = await getRepository(Agency)
        .createQueryBuilder("agency")
        .where("agency.emailHosts like :emailHost", {
          emailHost: `%${emailHost}%`,
        })
        .getOne();

      if (agency) {
        user.agency = agency;
      }

      //need to do user.save() to add to database.
      await user.save();

      const confirmationLink = await CreateConfirmationLink(
        url,
        user.id,
        redis_client
      );

      //email the user the link using notify
      await sendConfirmationEmail(email, name, confirmationLink);
      await sendSignUpMessage(name, role, email);

      if (ENVIRONMENT !== "production") {
        console.log(confirmationLink);
      }

      return basicApiMessage("UserRegistered", "User created");
    },
    resendConfirmationEmail: async (
      __,
      args: IResendConfirmation,
      { redis_client, url }
    ) => {
      //check valid email passed in
      try {
        await resendValidationSchema.validate(args, { abortEarly: false });
      } catch (errors) {
        return {
          __typename: "FieldErrors",
          errors: formatYupError(errors),
        };
      }

      const { email } = args;
      const userExists = await User.findOne({
        where: { email },
        select: ["id", "email", "verified", "name"],
      });

      //Check if user exists in database
      if (userExists && !userExists.verified) {
        const newConfirmationlink = await CreateConfirmationLink(
          url,
          userExists.id,
          redis_client
        );
        const name = userExists.name;

        await sendConfirmationEmail(email, name, newConfirmationlink);

        //Resend confirmation link
        return {
          __typename: "ConfirmationEmailSent",
          message: `Confirmation email sent to ${userExists.email}, if it exists`,
        };
      }
      return {
        __typename: "EmailNotSentError",
        path: "email",
        message: "There was an error sending the email",
      };
    },
  },
};
