import { gql, useQuery } from "@apollo/client";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  PeakDemand,
  PeakDemandVariables,
  PeakDemand_getPeakDemandData_PeakDemandData,
  PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData,
} from "../../graphql/PeakDemand";
import { NotFound } from "../../views/404-logged-in/404";
import PeakDemandView from "../../views/peakDemand/peakDemand";

interface Props extends RouteComponentProps<{ ua_id: string }> {} // key

export const PeakDataController: (arg0: Props) => any = ({ match }) => {
  const { ua_id } = match.params;

  const GET_URL_DATA = gql`
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
          output {
            visit_hour
            sessions
            pageViews
            timeOnPage
            aveSessionDuration
            pagesPerSession
            lastDay
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

  const { data, loading, error } = useQuery<PeakDemand, PeakDemandVariables>(
    GET_URL_DATA,
    {
      variables: { property_ua_id: ua_id },
    }
  );

  if (error) {
    return (
      <NotFound title="Error with request">
        <p>There was an unexpected error</p>
      </NotFound>
    );
  }

  if (loading) {
    return <PeakDemandView isLoading={true} />;
  }

  let isLoading: boolean = true;
  let peakTimeSeriesData:
    | PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData
    | undefined;
  let peakDemandData: PeakDemand_getPeakDemandData_PeakDemandData | undefined;

  if (data && data.getPeakTimeSeriesData && data.getPeakDemandData) {
    const apiResult = data.getPeakTimeSeriesData;
    const { __typename } = apiResult;
    isLoading = false;

    switch (__typename) {
      case "Error":
        break;
      case "PeakTimeSeriesData":
        const data = apiResult as PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData;
        peakTimeSeriesData = data;
        break;
      case "InvalidProperty":
        break;
    }

    const apiResult2 = data.getPeakDemandData;
    const apiResult2TypeName = apiResult2.__typename;
    switch (apiResult2TypeName) {
      case "Error":
        break;
      case "PeakDemandData":
        const data = apiResult2 as PeakDemand_getPeakDemandData_PeakDemandData;
        peakDemandData = data;
        break;
      case "InvalidProperty":
        break;
    }
    return (
      <PeakDemandView
        isLoading={isLoading}
        peakTimeSeriesData={peakTimeSeriesData}
        peakDemandData={peakDemandData}
      />
    );
  }
};
