import { gql } from "@apollo/client";

export const GET_DEMAND_DATA = gql`
  query PeakDemand($property_ua_id: String!) {
    getPeakTimeSeriesData(property_ua_id: $property_ua_id) {
      __typename

      ... on Error {
        message
      }

      ... on PeakTimeSeriesData {
        output {
          visit_hour
          sessions
          pageViews
        }
      }

      ... on InvalidProperty {
        message
      }

      ... on FieldErrors {
        errors {
          message
          path
        }
      }
    }
    getPeakDemandData(property_ua_id: $property_ua_id) {
      __typename

      ... on Error {
        message
      }

      ... on PeakDemandData {
        visit_hour
        sessions
        pageViews
        timeOnPage
        aveSessionDuration
        pagesPerSession
        lastDay
        top10 {
          pageCount
          pageUrl
          pageTitle
        }
        referral {
          peakTraffic
          peakCount
        }
      }

      ... on InvalidProperty {
        message
      }

      ... on FieldErrors {
        errors {
          message
          path
        }
      }
    }
  }
`;
