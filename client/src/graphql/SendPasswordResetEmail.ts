/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendPasswordResetEmail
// ====================================================

export interface SendPasswordResetEmail_sendForgotPasswordEmail_FieldErrors_errors {
  __typename: "FieldError";
  path: string;
  message: string;
}

export interface SendPasswordResetEmail_sendForgotPasswordEmail_FieldErrors {
  __typename: "FieldErrors";
  errors: SendPasswordResetEmail_sendForgotPasswordEmail_FieldErrors_errors[];
}

export interface SendPasswordResetEmail_sendForgotPasswordEmail_Error {
  __typename: "Error";
  path: string;
  message: string;
}

export interface SendPasswordResetEmail_sendForgotPasswordEmail_Success {
  __typename: "Success";
  message: string;
}

export type SendPasswordResetEmail_sendForgotPasswordEmail = SendPasswordResetEmail_sendForgotPasswordEmail_FieldErrors | SendPasswordResetEmail_sendForgotPasswordEmail_Error | SendPasswordResetEmail_sendForgotPasswordEmail_Success;

export interface SendPasswordResetEmail {
  sendForgotPasswordEmail: SendPasswordResetEmail_sendForgotPasswordEmail;
}

export interface SendPasswordResetEmailVariables {
  email?: string | null;
}
