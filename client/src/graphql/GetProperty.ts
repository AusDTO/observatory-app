/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProperty
// ====================================================

export interface GetProperty_getProperty_FieldErrors_errors {
  __typename: "FieldError";
  message: string;
  path: string;
}

export interface GetProperty_getProperty_FieldErrors {
  __typename: "FieldErrors";
  errors: GetProperty_getProperty_FieldErrors_errors[];
}

export interface GetProperty_getProperty_Error {
  __typename: "Error";
  message: string;
  path: string;
}

export interface GetProperty_getProperty_Property_agency {
  __typename: "Agency";
  name: string;
  emailHost: string;
}

export interface GetProperty_getProperty_Property {
  __typename: "Property";
  service_name: string;
  domain: string;
  ua_id: string;
  id: string;
  agency: GetProperty_getProperty_Property_agency | null;
}

export type GetProperty_getProperty = GetProperty_getProperty_FieldErrors | GetProperty_getProperty_Error | GetProperty_getProperty_Property;

export interface GetProperty {
  getProperty: GetProperty_getProperty;
}

export interface GetPropertyVariables {
  propertyId: string;
}
