import * as yup from "yup";

import { gql } from "@apollo/client";

export const sendFeedbackSchema = yup.object().shape({
  feedback: yup
    .string()
    .required("Please enter some feedback")
    .trim()
    .min(3, "Please enter some feedback")
    .test({
      name: "Check max length",
      message: "Maximum length of field is 500 characters",
      test: async function (this, value) {
        if (value.trim().length < 500) {
          return true;
        } else {
          return this.createError({
            message: `Maximum amount of characters is 500. You have used ${value.length}/500 characters`,
            path: "feedback",
          });
        }
      },
    }),
});

export const InitialValues = {
  feedback: "",
};

export const SEND_FEEDBACK_MUTATION = gql`
  mutation sendFeedback(
    $pageTitle: String
    $feedback: String!
    $pageUrl: String
  ) {
    sendFeedback(
      pageTitle: $pageTitle
      feedback: $feedback
      pageUrl: $pageUrl
    ) {
      __typename
      ... on FieldErrors {
        errors {
          message
          path
        }
      }
      ... on Error {
        message
        path
      }
      ... on Success {
        message
      }
    }
  }
`;
