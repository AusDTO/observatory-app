/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPropertiesAndUser
// ====================================================

export interface GetPropertiesAndUser_getUserProperties_Error {
  __typename: "Error";
  message: string;
  path: string;
}

export interface GetPropertiesAndUser_getUserProperties_PropertyList_properties {
  __typename: "Property";
  domain: string;
  ua_id: string;
  service_name: string;
  id: string;
}

export interface GetPropertiesAndUser_getUserProperties_PropertyList {
  __typename: "PropertyList";
  properties: GetPropertiesAndUser_getUserProperties_PropertyList_properties[];
}

export interface GetPropertiesAndUser_getUserProperties_NoProperties {
  __typename: "NoProperties";
  message: string;
}

export type GetPropertiesAndUser_getUserProperties = GetPropertiesAndUser_getUserProperties_Error | GetPropertiesAndUser_getUserProperties_PropertyList | GetPropertiesAndUser_getUserProperties_NoProperties;

export interface GetPropertiesAndUser_getUser_agency {
  __typename: "Agency";
  name: string;
}

export interface GetPropertiesAndUser_getUser {
  __typename: "User";
  name: string;
  email: string;
  id: string;
  agency: GetPropertiesAndUser_getUser_agency | null;
}

export interface GetPropertiesAndUser {
  getUserProperties: GetPropertiesAndUser_getUserProperties | null;
  getUser: GetPropertiesAndUser_getUser | null;
}
