import React, { useState } from "react";

import { RouteComponentProps } from "react-router-dom";
import { SnapshotLanding } from "../../views/site-snapshot/snapshot";
import { gql, useQuery } from "@apollo/client";

import { NotFound } from "../../views/404-logged-in/404";
import {
  ExecData,
  ExecDataVariables,
  ExecData_getExecWeeklyData,
  ExecData_getExecWeeklyData_ExecWeeklyArray,
} from "../../graphql/ExecData";
import { GET_EXEC_WEEKLY } from "./snapshot_schema";

interface Props extends RouteComponentProps<{ ua_id: string }> {} // key

export const SnapshotController: (arg0: Props) => any = ({
  history,
  match,
}) => {
  const { ua_id } = match.params;

  const { data, loading, error } = useQuery<ExecData, ExecDataVariables>(
    GET_EXEC_WEEKLY,
    { variables: { property_ua_id: ua_id } }
  );

  if (loading) {
    return null;
  }

  let weeklyOutputs;
  if (data && data.getExecWeeklyData && data.getExecDailyData) {
    const apiResult = data.getExecWeeklyData;
    const { __typename } = data.getExecWeeklyData;

    switch (__typename) {
      case "ExecWeeklyArray":
        const data = apiResult as ExecData_getExecWeeklyData_ExecWeeklyArray;
        weeklyOutputs = data;
        return <SnapshotLanding data={weeklyOutputs} ua_id={ua_id} />;
      // return (
      //   <NotFound title="Error fetching data">
      //     <p>Your data was not found</p>
      //   </NotFound>
      // );

      default:
        return (
          <NotFound title="Error fetching data">
            <p>Your data was not found</p>
          </NotFound>
        );
    }
  }
};
