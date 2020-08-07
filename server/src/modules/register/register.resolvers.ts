import { IUserType, IResendConfirmation } from "../../types/schema";
import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import * as yup from "yup";
import { formatYupError } from "../../util/formatYupError";
import { CreateConfirmationLink } from "../../util/createConfirmation/createConfirmationLink";
import { sendConfirmationEmail } from "../../util/sendConfirmationEmail/sendEmail";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter an email")
    .required()
    .max(255)
    .matches(/.gov.au$/, "Only government emails are allowed to apply"),
  password: yup
    .string()
    .required("Enter a password")
    .max(255)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
    ),
  name: yup.string().required().min(2),
  agency: yup.string().required().min(2),
  role: yup.string().required().min(2),
});

export const resolvers: ResolverMap = {
  Query: {
    bye: async () => {
      return "hello";
    },
  },
  Mutation: {
    register: async (parent: any, args: IUserType, { redis_client, url }) => {
      try {
        await validationSchema.validate(args, { abortEarly: false });
      } catch (errors) {
        return {
          __typename: "FieldErrors",
          errors: formatYupError(errors),
        };
      }

      const { email, password, name, agency, role } = args;

      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["email", "verified"],
      });

      if (userAlreadyExists && !userAlreadyExists.verified) {
        return {
          __typename: "UserAlreadyExistsError",
          message: `The user has been created, but the email is yet to be verified. Please check ${userAlreadyExists.email} for a confirmation link`,
          path: "Email",
        };
      }

      if (userAlreadyExists) {
        return {
          __typename: "UserAlreadyExistsError",
          message: `The user with email ${email} alrady exists`,
          path: "Email",
        };
      }

      //password is hashed in database
      const user = User.create({ email, password, name, agency, role });

      //need to do user.save() to add to database.
      await user.save();
      const confirmationLink = await CreateConfirmationLink(
        url,
        user.id,
        redis_client
      );

      //email the user the link:::

      await sendConfirmationEmail(email, name, confirmationLink);

      console.log(confirmationLink);

      return {
        __typename: "UserRegistered",
        message: "Created",
      };
    },
    resendConfirmationEmail: async (
      parent: any,
      args: IResendConfirmation,
      { redis_client, url }
    ) => {
      const { email } = args;

      const userExists = await User.findOne({
        where: { email },
        select: ["id", "email", "verified"],
      });

      //Check if user exists in data
      if (userExists && !userExists.verified) {
        const newConfirmationlink = await CreateConfirmationLink(
          url,
          userExists.id,
          redis_client
        );
        console.log(newConfirmationlink);
        //Resend confirmation link
        return {
          __typename: "ConfirmationEmailSent",
          message: `Confirmation email sent to ${userExists.email}, if it exists`,
        };
      }
      return {
        __typename: "EmailNotSentError",
        message: "There was an error sending the email",
      };
    },
  },
};
