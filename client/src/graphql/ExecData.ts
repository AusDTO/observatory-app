/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ExecData
// ====================================================

export interface ExecData_getExecWeeklyData_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface ExecData_getExecWeeklyData_FieldErrors {
  __typename: "FieldErrors";
  errors: ExecData_getExecWeeklyData_FieldErrors_errors[];
}

export interface ExecData_getExecWeeklyData_Error {
  __typename: "Error";
  message: string;
}

export interface ExecData_getExecWeeklyData_InvalidProperty {
  __typename: "InvalidProperty";
  message: string;
}

export interface ExecData_getExecWeeklyData_NoOutputData {
  __typename: "NoOutputData";
  message: string;
}

export interface ExecData_getExecWeeklyData_ExecWeeklyArray_output {
  __typename: "ExecWeekly";
  pageViews: string;
  sessions: string;
  timeOnPage: string | null;
  bounceRate: string;
  aveSessionsPerUser: string;
  pagesPerSession: string;
  aveSessionDuration: string;
  newUsers: string;
  users: string;
  returningUsers: string;
  dateEnding: string;
}

export interface ExecData_getExecWeeklyData_ExecWeeklyArray {
  __typename: "ExecWeeklyArray";
  output: ExecData_getExecWeeklyData_ExecWeeklyArray_output[];
}

export type ExecData_getExecWeeklyData = ExecData_getExecWeeklyData_FieldErrors | ExecData_getExecWeeklyData_Error | ExecData_getExecWeeklyData_InvalidProperty | ExecData_getExecWeeklyData_NoOutputData | ExecData_getExecWeeklyData_ExecWeeklyArray;

export interface ExecData_getExecDailyData_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface ExecData_getExecDailyData_FieldErrors {
  __typename: "FieldErrors";
  errors: ExecData_getExecDailyData_FieldErrors_errors[];
}

export interface ExecData_getExecDailyData_Error {
  __typename: "Error";
  message: string;
}

export interface ExecData_getExecDailyData_InvalidProperty {
  __typename: "InvalidProperty";
  message: string;
}

export interface ExecData_getExecDailyData_NoOutputData {
  __typename: "NoOutputData";
  message: string;
}

export interface ExecData_getExecDailyData_ExecDailyArray_output {
  __typename: "ExecDaily";
  pageViews: string;
  sessions: string;
  timeOnPage: string | null;
  bounceRate: string;
  aveSessionsPerUser: string;
  pagesPerSession: string;
  aveSessionDuration: string;
  users: string;
  newUsers: string;
  returningUsers: string;
  date: string;
}

export interface ExecData_getExecDailyData_ExecDailyArray {
  __typename: "ExecDailyArray";
  output: ExecData_getExecDailyData_ExecDailyArray_output[];
}

export type ExecData_getExecDailyData = ExecData_getExecDailyData_FieldErrors | ExecData_getExecDailyData_Error | ExecData_getExecDailyData_InvalidProperty | ExecData_getExecDailyData_NoOutputData | ExecData_getExecDailyData_ExecDailyArray;

export interface ExecData {
  getExecWeeklyData: ExecData_getExecWeeklyData | null;
  getExecDailyData: ExecData_getExecDailyData | null;
}

export interface ExecDataVariables {
  property_ua_id: string;
}
