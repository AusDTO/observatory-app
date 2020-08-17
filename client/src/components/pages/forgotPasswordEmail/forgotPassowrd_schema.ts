import * as yup from "yup";
import {
  passwordValidationFunction,
  emailValidationFunction,
} from "../../util/yup";
import { gql } from "@apollo/client";

export const InitialValues = {
  email: "",
  password: "",
};

export const validationSchema = yup.object().shape({
  email: emailValidationFunction(
    "Enter an email",
    "Only government emails are allowed access to this service"
  ),
});

export const FORGOT_PASSWORD_SCHEMA = gql`
  mutation SendPasswordResetEmail($email: String) {
    sendForgotPasswordEmail(email: $email) {
      __typename

      ... on FieldErrors {
        errors {
          path
          message
        }
      }

      ... on Error {
        path
        message
      }
      ... on Success {
        message
      }
    }
  }
`;
