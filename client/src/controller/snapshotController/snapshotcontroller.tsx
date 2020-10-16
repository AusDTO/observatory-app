import React, { useState } from "react";

import { RouteComponentProps } from "react-router-dom";
import { SnapshotLanding } from "../../views/site-snapshot/snapshot";
import { gql, useQuery } from "@apollo/client";
import {
  GetExecWeekly,
  GetExecWeeklyVariables,
  GetExecWeekly_getExecWeeklyData_ExecWeeklyArray,
} from "../../graphql/GetExecWeekly";
import { NotFound } from "../../views/404-logged-in/404";

interface Props extends RouteComponentProps<{ ua_id: string }> {} // key

export const SnapshotController: (arg0: Props) => any = ({
  history,
  match,
}) => {
  const GET_EXEC_WEEKLY = gql`
    query GetExecWeekly($property_ua_id: String!) {
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
            returningUsers
            dateEnding
          }
        }
      }
    }
  `;
  const { ua_id } = match.params;

  const { data, loading, error } = useQuery<
    GetExecWeekly,
    GetExecWeeklyVariables
  >(GET_EXEC_WEEKLY, { variables: { property_ua_id: ua_id } });

  if (loading) {
    return null;
  }

  let outputs;
  if (data && data.getExecWeeklyData) {
    const apiResult = data.getExecWeeklyData;
    const { __typename } = data.getExecWeeklyData;

    switch (__typename) {
      case "ExecWeeklyArray":
        const data = apiResult as GetExecWeekly_getExecWeeklyData_ExecWeeklyArray;
        outputs = data;
        return <SnapshotLanding data={outputs} />;

      default:
        return (
          <NotFound title="Error fetching data">
            <p>Your data was not found</p>
          </NotFound>
        );
    }
  }
};
