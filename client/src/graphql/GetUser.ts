/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_getuser {
  __typename: "User";
  email: string | null;
  id: string | null;
}

export interface GetUser {
  getuser: GetUser_getuser | null;
}

export interface GetUserVariables {
  id: string;
  email: string;
}
