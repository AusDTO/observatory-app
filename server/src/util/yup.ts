import * as yup from "yup";

export const passwordValidator = yup
  .string()
  .required("Enter a password")
  .max(255)
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    "Must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
  );

export const emailValidator = yup
  .string()
  .email("Enter an email")
  .required()
  .max(255)
  .matches(/.gov.au$/, "Only government emails are allowed to apply");

export const ua_id_schema = yup
  .string()
  .matches(
    /(UA|ua)-[0-9]+-?[0-9]{1,3}$/,
    "You have entered a UAID that is not valid, check your data and try again"
  );
