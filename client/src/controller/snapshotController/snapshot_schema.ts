import { gql } from "@apollo/client";

export const GET_EXEC_WEEKLY = gql`
  query ExecData($property_ua_id: String!) {
    getExecWeeklyData(property_ua_id: $property_ua_id) {
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
          users
          returningUsers
          dateEnding
          topTenPageViews {
            pageUrl
            pageTitle
            percentage
            percentage
            rank
            pageViews
          }
          topTenGrowth {
            pageUrl
            pageTitle
            percentage
            rank
            pageViews
          }
        }
      }
    }

    getExecHourlyData(property_ua_id: $property_ua_id) {
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
      ... on ExecHourlyArray {
        output {
          pageViews
          aveSessionDuration
          visit_hour
        }
      }
    }

    getExecDailyData(property_ua_id: $property_ua_id) {
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
      ... on ExecDailyArray {
        output {
          pageViews
          sessions
          timeOnPage
          bounceRate
          aveSessionsPerUser
          pagesPerSession
          aveSessionDuration
          users
          newUsers
          returningUsers
          date
          topTenPageViews {
            pageUrl
            pageTitle
            percentage
            percentage
            rank
            pageViews
          }
          topTenGrowth {
            pageUrl
            pageTitle
            percentage
            rank
            pageViews
          }
        }
      }
    }
  }
`;
