import { gql, useQuery } from "@apollo/client";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  PeakDemandTimeSeries,
  PeakDemandTimeSeriesVariables,
} from "../../graphql/PeakDemandTimeSeries";
import PeakDemand from "../../views/peakDemand/peakDemand";

interface Props extends RouteComponentProps<{ ua_id: string }> {} // key

export const PeakDataController: (arg0: Props) => any = ({ match }) => {
  const { ua_id } = match.params;

  const GET_URL_DATA = gql`
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

  const { data, loading, error } = useQuery<
    PeakDemandTimeSeries,
    PeakDemandTimeSeriesVariables
  >(GET_URL_DATA, {
    variables: { property_ua_id: ua_id },
  });

  if (!loading) {
    console.log(data);
  }

  return <PeakDemand />;
};
