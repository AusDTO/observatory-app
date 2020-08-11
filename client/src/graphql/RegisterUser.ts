/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterUser
// ====================================================

export interface RegisterUser_register_UserRegistered {
  __typename: "UserRegistered";
  message: string;
}

export interface RegisterUser_register_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface RegisterUser_register_FieldErrors {
  __typename: "FieldErrors";
  errors: RegisterUser_register_FieldErrors_errors[] | null;
}

export interface RegisterUser_register_UserAlreadyExistsError {
  __typename: "UserAlreadyExistsError";
  message: string;
  path: string;
}

export type RegisterUser_register =
  | RegisterUser_register_UserRegistered
  | RegisterUser_register_FieldErrors
  | RegisterUser_register_UserAlreadyExistsError;

export interface RegisterUser {
  register: RegisterUser_register | null;
}

export interface RegisterUserVariables {
  email: string;
  password?: string | null;
  name?: string | null;
  agency?: string | null;
  role?: string | null;
}
