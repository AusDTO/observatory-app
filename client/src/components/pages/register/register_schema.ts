import * as yup from "yup";
import { gql } from "@apollo/client";

export const InitialValues = {
  name: "",
  email: "",
  agency: "",
  role: "",
  password: "",
};

export const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Enter an email")
    .max(255)
    .matches(/.gov.au$/, "Only government emails are allowed to apply"),
  password: yup
    .string()
    .required("Enter a password")
    .max(255)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Your password needs to be stronger"
    ),
  name: yup.string().required("Enter a name").min(2),
  agency: yup.string().required("Enter an agency").min(2),
  role: yup.string().required("Enter your role").min(2),
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
