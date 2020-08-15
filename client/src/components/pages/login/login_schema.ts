import * as yup from "yup";
import {
  emailValidation,
  passwordValidation,
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
  password: passwordValidationFunction(
    "Enter a password",
    "Check if your password contains: 8 characters, including one uppercase, one lowercase, one number and one special case character"
  ),
});

export const LOGIN_MUTATION = gql`
  mutation LoginUser($email: String, $password: String) {
    login(email: $email, password: $password) {
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
