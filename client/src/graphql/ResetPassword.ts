/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResetPassword
// ====================================================

export interface ResetPassword_resetPassword_FieldErrors_errors {
  __typename: "FieldError";
  path: string;
  message: string;
}

export interface ResetPassword_resetPassword_FieldErrors {
  __typename: "FieldErrors";
  errors: ResetPassword_resetPassword_FieldErrors_errors[];
}

export interface ResetPassword_resetPassword_Error {
  __typename: "Error";
  message: string;
  path: string;
}

export interface ResetPassword_resetPassword_Success {
  __typename: "Success";
  message: string;
}

export type ResetPassword_resetPassword = ResetPassword_resetPassword_FieldErrors | ResetPassword_resetPassword_Error | ResetPassword_resetPassword_Success;

export interface ResetPassword {
  resetPassword: ResetPassword_resetPassword;
}

export interface ResetPasswordVariables {
  newPassword?: string | null;
  key?: string | null;
}
