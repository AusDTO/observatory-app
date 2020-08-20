import { gql } from "@apollo/client";
import * as yup from "yup";
import { passwordValidation } from "../../util/yup";

export const validationSchema = yup.object().shape({
  password: passwordValidation,
});

export const InitialValues = {
  password: "",
};

export const RESET_PASSWORD_SCHEMA = gql`
  mutation ResetPassword($newPassword: String, $key: String) {
    resetPassword(newPassword: $newPassword, key: $key) {
      __typename
      ... on FieldErrors {
        errors {
          path
          message
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

export const IS_RESET_LINK_VALID_QUERY = gql`
  query ResetLinkValid($key: String!) {
    isResetLinkValid(key: $key)
  }
`;
