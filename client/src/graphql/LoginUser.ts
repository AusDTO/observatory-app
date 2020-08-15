/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: LoginUser
// ====================================================

export interface LoginUser_login_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface LoginUser_login_FieldErrors {
  __typename: "FieldErrors";
  errors: LoginUser_login_FieldErrors_errors[];
}

export interface LoginUser_login_Error {
  __typename: "Error";
  message: string;
  path: string;
}

export interface LoginUser_login_Success {
  __typename: "Success";
  message: string;
}

export type LoginUser_login = LoginUser_login_FieldErrors | LoginUser_login_Error | LoginUser_login_Success;

export interface LoginUser {
  login: LoginUser_login | null;
}

export interface LoginUserVariables {
  email?: string | null;
  password?: string | null;
}
