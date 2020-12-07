import { gql } from "@apollo/client";

export const GET_PROPERTY_SCHEMA = gql`
  query GetProperty($property_ua_id: String!) {
    getProperty(property_ua_id: $property_ua_id) {
      __typename
      ... on FieldErrors {
        errors {
          message
          path
        }
      }
      ... on Error {
        message
        path
      }
      ... on Property {
        service_name
        domain
        ua_id
        id
        agency {
          name
        }
      }
    }
  }
`;
