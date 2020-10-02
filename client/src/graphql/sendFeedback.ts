/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: sendFeedback
// ====================================================

export interface sendFeedback_sendFeedback_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface sendFeedback_sendFeedback_FieldErrors {
  __typename: "FieldErrors";
  errors: sendFeedback_sendFeedback_FieldErrors_errors[];
}

export interface sendFeedback_sendFeedback_Error {
  __typename: "Error";
  message: string;
  path: string;
}

export interface sendFeedback_sendFeedback_Success {
  __typename: "Success";
  message: string;
}

export type sendFeedback_sendFeedback = sendFeedback_sendFeedback_FieldErrors | sendFeedback_sendFeedback_Error | sendFeedback_sendFeedback_Success;

export interface sendFeedback {
  sendFeedback: sendFeedback_sendFeedback | null;
}

export interface sendFeedbackVariables {
  pageTitle?: string | null;
  feedback: string;
  pageUrl?: string | null;
}
