import { useQuery } from "@apollo/client";
import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { RouteComponentProps } from "react-router-dom";
import {
  UrlData,
  UrlDataVariables,
  UrlData_getDataFromUrl_Error,
  UrlData_getDataFromUrl_FieldErrors,
  UrlData_getDataFromUrl_InvalidProperty,
  UrlData_getDataFromUrl_UrlDataResult,
} from "../../graphql/UrlData";
import { NotFound } from "../../views/404-logged-in/404";
import EngagementView from "../../views/urlEngagement/engagementView";
import { GET_URL_DATA } from "./schema";

interface Props extends RouteComponentProps<{ ua_id: string }> {} // key

export const EngagementUrlController: (arg0: Props) => any = ({
  history,
  match,
  location,
}) => {
  const { ua_id } = match.params;

  let params = new URLSearchParams(location.search);
  const timePeriod = params.get("timePeriod") || "";
  const urlParam = params.get("url") || "";

  const { loading, data, error } = useQuery<UrlData, UrlDataVariables>(
    GET_URL_DATA,
    {
      variables: {
        property_ua_id: ua_id,
        url: urlParam,
        dateType: timePeriod as string,
      },
    }
  );

  if (loading) {
    return (
      <EngagementView
        isLoading={true}
        initialUrl={urlParam}
        timePeriod={timePeriod}
        ua_id={ua_id}
      />
    );
  }

  if (error) {
    return (
      <NotFound title="Error with request">
        <p>There was an unexpected error</p>
      </NotFound>
    );
  }

  let urlData: UrlData_getDataFromUrl_UrlDataResult | undefined;
  let errorMessage: string | undefined;
  let isLoading: boolean = true;

  if (data && data.getDataFromUrl) {
    const apiResult = data.getDataFromUrl;

    const { __typename } = apiResult;
    switch (__typename) {
      case "UrlDataResult":
        const data = apiResult as UrlData_getDataFromUrl_UrlDataResult;
        isLoading = false;
        urlData = data;
        break;
      case "InvalidProperty":
        const { message } = apiResult as UrlData_getDataFromUrl_InvalidProperty;
        errorMessage = message;
        isLoading = false;
        break;
      case "Error":
        const errorResult = apiResult as UrlData_getDataFromUrl_Error;
        errorMessage = errorResult.message;
        isLoading = false;
        break;
      case "FieldErrors":
        const fieldErrorResult = apiResult as UrlData_getDataFromUrl_FieldErrors;
        errorMessage = fieldErrorResult.errors[0].message;
        isLoading = false;
        break;
    }
    return (
      <EngagementView
        urlData={urlData}
        timePeriod={timePeriod}
        errorMessage={errorMessage}
        isLoading={isLoading}
        initialUrl={urlParam}
        ua_id={ua_id}
      />
    );
  }
};
