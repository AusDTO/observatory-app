import { gql } from "@apollo/client";

export const GET_PROPERTIES_USER_SCHEMA = gql`
  query GetProperties {
    getUserProperties {
      __typename
      ... on Error {
        message
        path
      }
      ... on PropertyList {
        properties {
          domain
          ua_id
          service_name
          id
        }
      }
      ... on NoProperties {
        message
      }
    }
    getUser {
      name
      email
      id
      agency {
        name
      }
    }
  }
`;
