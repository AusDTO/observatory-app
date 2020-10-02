import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import { ISendFeedbackType } from "../../types/schema";

import { basicApiErrorMessage } from "../../util/constants";
import * as yup from "yup";
import { formatYupError } from "../../util/formatYupError";

import { sendFeedbackMessage } from "../../util/sendSlackMessage/sendMessageSlack";

const sendFeedbackValidator = yup.object().shape({
  feedback: yup.string().trim().required(),
  pageTitle: yup.string().trim().required(),
  pageUrl: yup.string().trim().required(),
});

export const resolvers: ResolverMap = {
  Query: {
    random1: async (parent, args, { redis_client, url }) => {
      return "hello";
    },
  },
  Mutation: {
    sendFeedback: async (parent: any, args: ISendFeedbackType, { session }) => {
      const { userId } = session;

      const user = await User.findOne({
        where: { id: userId },
      });

      if (!user) {
        return basicApiErrorMessage("Not authenticated", "user");
      }

      try {
        await sendFeedbackValidator.validate(args, { abortEarly: false });
      } catch (errors) {
        return {
          __typename: "FieldErrors",
          errors: formatYupError(errors),
        };
      }

      const { feedback, pageTitle, pageUrl } = args;

      await sendFeedbackMessage(pageUrl, pageTitle, feedback);

      return {
        __typename: "Success",
        message: "Successfully captured feedback",
      };
    },
  },
};
