import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React, { useState } from "react";

import { RouteComponentProps } from "react-router-dom";
import {
  UrlData,
  UrlDataVariables,
  UrlData_getDataFromUrl_UrlDataResult,
  UrlData_getProperty,
} from "../../graphql/UrlData";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import EngagementView from "../../views/urlEngagement/engagementView";

interface Props extends RouteComponentProps<{ ua_id: string }> {} // key

export const EngagementUrlController: (arg0: Props) => any = ({
  history,
  match,
  location,
}) => {
  const { ua_id } = match.params;

  let params = new URLSearchParams(location.search);
  const timePeriod = params.get("timePeriod");
  const urlParam = params.get("url") as string;
  const GET_URL_DATA = gql`
    query UrlData($property_ua_id: String!, $url: String!, $dateType: String!) {
      getDataFromUrl(
        property_ua_id: $property_ua_id
        url: $url
        dateType: $dateType
      ) {
        __typename
        ... on FieldErrors {
          errors {
            message
            path
          }
        }
        ... on InvalidProperty {
          message
        }
        ... on Message {
          message
        }
        ... on Error {
          message
        }
        ... on UrlDataResult {
          output {
            date
            desktop
            time_on_page
          }
        }
      }
    }
  `;

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

  let urlData;

  if (loading) {
    return <EngagementView isLoading={true} />;
  }

  if (data && data.getDataFromUrl) {
    const apiResult = data.getDataFromUrl;

    const { __typename } = apiResult;
    switch (__typename) {
      case "UrlDataResult":
        const data = apiResult as UrlData_getDataFromUrl_UrlDataResult;
        return (
          <EngagementView
            urlData={data}
            isLoading={false}
            initialUrl={urlParam}
          />
        );
    }
    return <EngagementView isLoading={false} initialUrl={urlParam} />;
  }
};
