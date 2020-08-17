import * as yup from "yup";

export const emailValidation = yup
  .string()
  .email("Enter a valid email")
  .required("Email is required")
  .max(255)
  .matches(/.gov.au$/, "Only government emails are allowed to apply");

export const passwordValidation = yup
  .string()
  .required("Password is required")
  .max(255)
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    "Your password needs to be stronger"
  );

export const passwordValidationFunction = (
  requiredMessage: string,
  passwordStrengthMessage: string
) =>
  yup
    .string()
    .required(requiredMessage)
    .max(255)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      passwordStrengthMessage
    );

export const emailValidationFunction = (
  requiredMessage: string,
  govEmailMessage: string
) =>
  yup
    .string()
    .email("Enter a valid email")
    .required(requiredMessage)
    .max(255)
    .matches(/.gov.au$/, govEmailMessage);
