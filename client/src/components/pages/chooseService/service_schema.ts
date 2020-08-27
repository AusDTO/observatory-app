import { gql } from "@apollo/client";

export const GET_PROPERTIES_SCHEMA = gql`
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
        }
      }
      ... on NoProperties {
        message
      }
    }
  }
`;
