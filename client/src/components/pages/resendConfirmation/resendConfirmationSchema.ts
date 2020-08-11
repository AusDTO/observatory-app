import { gql } from "@apollo/client";
import * as yup from "yup";

export const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Enter an email")
    .max(255)
    .matches(/.gov.au$/, "Only government emails are allowed to apply"),
});

export const InitialValues = {
  email: "",
};

export const RESEND_CONFIRMATION_SCHEMA = gql`
  mutation ResendConfirmation($email: String!) {
    resendConfirmationEmail(email: $email) {
      __typename
      ... on ConfirmationEmailSent {
        message
      }

      ... on EmailNotSentError {
        message
      }
    }
  }
`;
