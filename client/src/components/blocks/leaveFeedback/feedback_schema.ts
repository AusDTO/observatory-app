import * as yup from "yup";

import { gql } from "@apollo/client";

export const questionSchema = yup.object().shape({
  feedback: yup.string().required("Please enter a question"),
});

export const InitialValues = {
  email: "",
  password: "",
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
