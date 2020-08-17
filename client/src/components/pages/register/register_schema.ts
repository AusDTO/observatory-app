import * as yup from "yup";
import { gql } from "@apollo/client";
import { passwordValidation, emailValidation } from "../../util/yup";

export const InitialValues = {
  name: "",
  email: "",
  agency: "",
  role: "",
  password: "",
};

export const validationSchema = yup.object().shape({
  email: emailValidation,
  password: passwordValidation,
  name: yup.string().required("Name is required").min(2),
  agency: yup.string().required("Agency is required").min(2),
  role: yup.string().required("Role is required").min(2),
});

export const REGISTER_SCHEMA = gql`
  mutation RegisterUser(
    $email: String!
    $password: String!
    $name: String!
    $agency: String!
    $role: String!
  ) {
    register(
      email: $email
      password: $password
      name: $name
      agency: $agency
      role: $role
    ) {
      __typename
      ... on UserRegistered {
        message
      }
      ... on FieldErrors {
        errors {
          message
          path
        }
      }
      ... on UserAlreadyExistsError {
        message
        path
      }
    }
  }
`;
