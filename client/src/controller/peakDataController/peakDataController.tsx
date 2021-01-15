import { gql, useQuery } from "@apollo/client";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  PeakDemandTimeSeries,
  PeakDemandTimeSeriesVariables,
  PeakDemandTimeSeries_getPeakTimeSeriesData_PeakTimeSeriesData,
} from "../../graphql/PeakDemandTimeSeries";
import { NotFound } from "../../views/404-logged-in/404";
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

  if (error) {
    return (
      <NotFound title="Error with request">
        <p>There was an unexpected error</p>
      </NotFound>
    );
  }

  if (loading) {
    return <PeakDemand isLoading={true} />;
  }

  let isLoading: boolean = true;
  let peakData:
    | PeakDemandTimeSeries_getPeakTimeSeriesData_PeakTimeSeriesData
    | undefined;

  if (data && data.getPeakTimeSeriesData) {
    const apiResult = data.getPeakTimeSeriesData;
    const { __typename } = apiResult;
    isLoading = false;

    switch (__typename) {
      case "Error":
        break;
      case "PeakTimeSeriesData":
        const data = apiResult as PeakDemandTimeSeries_getPeakTimeSeriesData_PeakTimeSeriesData;
        peakData = data;
        break;
      case "InvalidProperty":
        break;
    }
    return <PeakDemand isLoading={isLoading} peakData={peakData} />;
  }
};
