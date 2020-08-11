/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResendConfirmation
// ====================================================

export interface ResendConfirmation_resendConfirmationEmail_ConfirmationEmailSent {
  __typename: "ConfirmationEmailSent";
  message: string;
}

export interface ResendConfirmation_resendConfirmationEmail_EmailNotSentError {
  __typename: "EmailNotSentError";
  message: string;
}

export type ResendConfirmation_resendConfirmationEmail = ResendConfirmation_resendConfirmationEmail_ConfirmationEmailSent | ResendConfirmation_resendConfirmationEmail_EmailNotSentError;

export interface ResendConfirmation {
  resendConfirmationEmail: ResendConfirmation_resendConfirmationEmail;
}

export interface ResendConfirmationVariables {
  email: string;
}
