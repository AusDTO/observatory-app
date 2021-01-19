/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PeakDemand
// ====================================================

export interface PeakDemand_getPeakTimeSeriesData_Error {
  __typename: "Error";
  message: string;
}

export interface PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData_output {
  __typename: "PeakTimeSeriesObject";
  visit_hour: string;
  sessions: string;
  pageViews: string;
}

export interface PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData {
  __typename: "PeakTimeSeriesData";
  output: PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData_output[];
}

export interface PeakDemand_getPeakTimeSeriesData_InvalidProperty {
  __typename: "InvalidProperty";
  message: string;
}

export interface PeakDemand_getPeakTimeSeriesData_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface PeakDemand_getPeakTimeSeriesData_FieldErrors {
  __typename: "FieldErrors";
  errors: PeakDemand_getPeakTimeSeriesData_FieldErrors_errors[];
}

export type PeakDemand_getPeakTimeSeriesData = PeakDemand_getPeakTimeSeriesData_Error | PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData | PeakDemand_getPeakTimeSeriesData_InvalidProperty | PeakDemand_getPeakTimeSeriesData_FieldErrors;

export interface PeakDemand_getPeakDemandData_Message {
  __typename: "Message";
}

export interface PeakDemand_getPeakDemandData_Error {
  __typename: "Error";
  message: string;
}

export interface PeakDemand_getPeakDemandData_PeakDemandData_output {
  __typename: "PeakDataObject";
  visit_hour: string;
  sessions: string;
  pageViews: string;
  timeOnPage: string;
  aveSessionDuration: string;
  pagesPerSession: string;
  lastDay: string;
}

export interface PeakDemand_getPeakDemandData_PeakDemandData {
  __typename: "PeakDemandData";
  output: PeakDemand_getPeakDemandData_PeakDemandData_output[];
}

export interface PeakDemand_getPeakDemandData_InvalidProperty {
  __typename: "InvalidProperty";
  message: string;
}

export interface PeakDemand_getPeakDemandData_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface PeakDemand_getPeakDemandData_FieldErrors {
  __typename: "FieldErrors";
  errors: PeakDemand_getPeakDemandData_FieldErrors_errors[];
}

export type PeakDemand_getPeakDemandData = PeakDemand_getPeakDemandData_Message | PeakDemand_getPeakDemandData_Error | PeakDemand_getPeakDemandData_PeakDemandData | PeakDemand_getPeakDemandData_InvalidProperty | PeakDemand_getPeakDemandData_FieldErrors;

export interface PeakDemand {
  getPeakTimeSeriesData: PeakDemand_getPeakTimeSeriesData | null;
  getPeakDemandData: PeakDemand_getPeakDemandData | null;
}

export interface PeakDemandVariables {
  property_ua_id: string;
}
