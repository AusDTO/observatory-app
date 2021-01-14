import { gql } from "@apollo/client";

export const GET_URL_DATA = gql`
  query PeakDemandTimeSeries($property_ua_id: String!) {
    getPeakTimeSeriesData(property_ua_id: $property_ua_id) {
      __typename

      ... on Error {
        message
      }

      ... on PeakTimeSeriesData {
        output {
          visit_hour
          sessions
          pageviews
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
