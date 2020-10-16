/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetExecWeekly
// ====================================================

export interface GetExecWeekly_getExecWeeklyData_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface GetExecWeekly_getExecWeeklyData_FieldErrors {
  __typename: "FieldErrors";
  errors: GetExecWeekly_getExecWeeklyData_FieldErrors_errors[];
}

export interface GetExecWeekly_getExecWeeklyData_Error {
  __typename: "Error";
  message: string;
}

export interface GetExecWeekly_getExecWeeklyData_InvalidProperty {
  __typename: "InvalidProperty";
  message: string;
}

export interface GetExecWeekly_getExecWeeklyData_NoOutputData {
  __typename: "NoOutputData";
  message: string;
}

export interface GetExecWeekly_getExecWeeklyData_ExecWeeklyArray_output {
  __typename: "ExecWeekly";
  pageViews: string;
  sessions: string;
  timeOnPage: string | null;
  bounceRate: string;
  aveSessionsPerUser: string;
  pagesPerSession: string;
  aveSessionDuration: string;
  newUsers: string;
  returningUsers: string;
  dateEnding: string;
}

export interface GetExecWeekly_getExecWeeklyData_ExecWeeklyArray {
  __typename: "ExecWeeklyArray";
  output: GetExecWeekly_getExecWeeklyData_ExecWeeklyArray_output[];
}

export type GetExecWeekly_getExecWeeklyData = GetExecWeekly_getExecWeeklyData_FieldErrors | GetExecWeekly_getExecWeeklyData_Error | GetExecWeekly_getExecWeeklyData_InvalidProperty | GetExecWeekly_getExecWeeklyData_NoOutputData | GetExecWeekly_getExecWeeklyData_ExecWeeklyArray;

export interface GetExecWeekly {
  getExecWeeklyData: GetExecWeekly_getExecWeeklyData | null;
}

export interface GetExecWeeklyVariables {
  property_ua_id: string;
}
