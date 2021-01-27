import { useQuery } from "@apollo/client";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  PeakDemand,
  PeakDemandVariables,
  PeakDemand_getPeakDemandData_Error,
  PeakDemand_getPeakDemandData_InvalidProperty,
  PeakDemand_getPeakDemandData_PeakDemandData,
  PeakDemand_getPeakTimeSeriesData_Error,
  PeakDemand_getPeakTimeSeriesData_InvalidProperty,
  PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData,
} from "../../graphql/PeakDemand";
import { NotFound } from "../../views/404-logged-in/404";
import PeakDemandView from "../../views/peakDemand/peakDemand";
import { GET_DEMAND_DATA } from "./schema";

interface Props extends RouteComponentProps<{ ua_id: string }> {} // key

export const PeakDataController: (arg0: Props) => any = ({ match }) => {
  const { ua_id } = match.params;

  const { data, loading, error } = useQuery<PeakDemand, PeakDemandVariables>(
    GET_DEMAND_DATA,
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
  let errorMessage: string | undefined = undefined;

  if (data && data.getPeakTimeSeriesData && data.getPeakDemandData) {
    const apiResult = data.getPeakTimeSeriesData;
    const { __typename } = apiResult;
    isLoading = false;

    switch (__typename) {
      case "Error":
        const errorResponse = apiResult as PeakDemand_getPeakTimeSeriesData_Error;
        const { message } = errorResponse;
        errorMessage = message;
        break;
      case "PeakTimeSeriesData":
        const data = apiResult as PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData;
        peakTimeSeriesData = data;
        break;
      case "InvalidProperty":
        const invalidPropertyResponse = apiResult as PeakDemand_getPeakTimeSeriesData_InvalidProperty;
        errorMessage = invalidPropertyResponse.message;
        break;
      case "FieldErrors":
        errorMessage = "There was an error fetching your data";
        break;
      default:
        errorMessage = "There was an error fetching your data";
        break;
    }

    const apiResult2 = data.getPeakDemandData;
    const apiResult2TypeName = apiResult2.__typename;
    switch (apiResult2TypeName) {
      case "Error":
        const errorResponse = apiResult2 as PeakDemand_getPeakDemandData_Error;
        errorMessage = errorResponse.message;
        break;
      case "PeakDemandData":
        const data = apiResult2 as PeakDemand_getPeakDemandData_PeakDemandData;
        peakDemandData = data;
        break;
      case "InvalidProperty":
        const invalidPropertyData = apiResult2 as PeakDemand_getPeakDemandData_InvalidProperty;
        errorMessage = invalidPropertyData.message;
        break;
      case "FieldErrors":
        errorMessage = "There was an error fetching your data";
        break;
      default:
        errorMessage = "There was an error fetching your data";
        break;
    }
    return (
      <PeakDemandView
        errorMessage={errorMessage}
        isLoading={isLoading}
        peakTimeSeriesData={peakTimeSeriesData}
        peakDemandData={peakDemandData}
      />
    );
  }
};
