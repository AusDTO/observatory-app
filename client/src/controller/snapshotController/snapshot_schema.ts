import { gql } from "@apollo/client";

export const GET_EXEC_WEEKLY = gql`
  query GetExecWeekly($property_ua_id: String!) {
    getExecWeekly(property_ua_id: $property_ua_id) {
      __typename
      ... on FieldErrors {
        errors {
          message
          path
        }
      }
      ... on Error {
        message
      }
      ... on InvalidProperty {
        message
      }
      ... on NoOutputData {
        message
      }
      ... on ExecWeeklyArray {
        output {
          pageViews
          sessions
          timeOnPage
          bounceRate
          aveSessionsPerUser
          pagesPerSession
          aveSessionDuration
          newUsers
          returningUsers
          dateEnding
        }
      }
    }
  }
`;
