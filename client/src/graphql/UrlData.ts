/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UrlData
// ====================================================

export interface UrlData_getDataFromUrl_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface UrlData_getDataFromUrl_FieldErrors {
  __typename: "FieldErrors";
  errors: UrlData_getDataFromUrl_FieldErrors_errors[];
}

export interface UrlData_getDataFromUrl_InvalidProperty {
  __typename: "InvalidProperty";
  message: string;
}

export interface UrlData_getDataFromUrl_Message {
  __typename: "Message";
  message: string;
}

export interface UrlData_getDataFromUrl_Error {
  __typename: "Error";
  message: string;
}

export interface UrlData_getDataFromUrl_UrlDataResult_output {
  __typename: "UrlData";
  date: string;
  desktop: string;
  time_on_page: string;
}

export interface UrlData_getDataFromUrl_UrlDataResult {
  __typename: "UrlDataResult";
  output: UrlData_getDataFromUrl_UrlDataResult_output[];
}

export type UrlData_getDataFromUrl = UrlData_getDataFromUrl_FieldErrors | UrlData_getDataFromUrl_InvalidProperty | UrlData_getDataFromUrl_Message | UrlData_getDataFromUrl_Error | UrlData_getDataFromUrl_UrlDataResult;

export interface UrlData_getProperty_Error {
  __typename: "Error" | "FieldErrors";
}

export interface UrlData_getProperty_Property {
  __typename: "Property";
  domain: string;
}

export type UrlData_getProperty = UrlData_getProperty_Error | UrlData_getProperty_Property;

export interface UrlData {
  getDataFromUrl: UrlData_getDataFromUrl;
  getProperty: UrlData_getProperty;
}

export interface UrlDataVariables {
  property_ua_id: string;
  url: string;
  dateType: string;
}
