/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PeakDemandTimeSeries
// ====================================================

export interface PeakDemandTimeSeries_getPeakTimeSeriesData_Error {
  __typename: "Error";
  message: string;
}

export interface PeakDemandTimeSeries_getPeakTimeSeriesData_PeakTimeSeriesData_output {
  __typename: "PeakTimeSeriesObject";
  visit_hour: string;
  sessions: string;
  pageviews: string;
}

export interface PeakDemandTimeSeries_getPeakTimeSeriesData_PeakTimeSeriesData {
  __typename: "PeakTimeSeriesData";
  output: PeakDemandTimeSeries_getPeakTimeSeriesData_PeakTimeSeriesData_output[];
}

export interface PeakDemandTimeSeries_getPeakTimeSeriesData_InvalidProperty {
  __typename: "InvalidProperty";
  message: string;
}

export interface PeakDemandTimeSeries_getPeakTimeSeriesData_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface PeakDemandTimeSeries_getPeakTimeSeriesData_FieldErrors {
  __typename: "FieldErrors";
  errors: PeakDemandTimeSeries_getPeakTimeSeriesData_FieldErrors_errors[];
}

export type PeakDemandTimeSeries_getPeakTimeSeriesData = PeakDemandTimeSeries_getPeakTimeSeriesData_Error | PeakDemandTimeSeries_getPeakTimeSeriesData_PeakTimeSeriesData | PeakDemandTimeSeries_getPeakTimeSeriesData_InvalidProperty | PeakDemandTimeSeries_getPeakTimeSeriesData_FieldErrors;

export interface PeakDemandTimeSeries {
  getPeakTimeSeriesData: PeakDemandTimeSeries_getPeakTimeSeriesData | null;
}

export interface PeakDemandTimeSeriesVariables {
  property_ua_id: string;
}
