import { gql } from "@apollo/client";

export const GET_PROPERTY_SCHEMA = gql`
  query GetProperty($propertyId: String!) {
    getProperty(propertyId: $propertyId) {
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
          emailHost
        }
      }
    }
  }
`;
