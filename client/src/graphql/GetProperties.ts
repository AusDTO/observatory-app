/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetProperties
// ====================================================

export interface GetProperties_getUserProperties_Error {
  __typename: "Error";
  message: string;
  path: string;
}

export interface GetProperties_getUserProperties_PropertyList_properties {
  __typename: "Property";
  domain: string;
  ua_id: string;
  service_name: string;
}

export interface GetProperties_getUserProperties_PropertyList {
  __typename: "PropertyList";
  properties: GetProperties_getUserProperties_PropertyList_properties[];
}

export interface GetProperties_getUserProperties_NoProperties {
  __typename: "NoProperties";
  message: string;
}

export type GetProperties_getUserProperties = GetProperties_getUserProperties_Error | GetProperties_getUserProperties_PropertyList | GetProperties_getUserProperties_NoProperties;

export interface GetProperties {
  getUserProperties: GetProperties_getUserProperties;
}
