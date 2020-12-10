import { useQuery } from "@apollo/client";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  ExecData,
  ExecDataVariables,
  ExecData_getExecDailyData_ExecDailyArray,
  ExecData_getExecHourlyData_ExecHourlyArray,
  ExecData_getExecWeeklyData_ExecWeeklyArray,
} from "../../graphql/ExecData";
import { NotFound } from "../../views/404-logged-in/404";
import SnapshotLanding from "../../views/site-snapshot/snapshot";
import { GET_EXEC_WEEKLY } from "./snapshot_schema";

interface Props extends RouteComponentProps<{ ua_id: string }> {} // key

//FIX should not need all the data for this to load
export const SnapshotController: (arg0: Props) => any = ({
  history,
  match,
  location,
}) => {
  const { ua_id } = match.params;
  let params = new URLSearchParams(location.search); //FIX may need to refactor to work in IE
  const timePeriod = params.get("timePeriod");

  const { data, loading, error } = useQuery<ExecData, ExecDataVariables>(
    GET_EXEC_WEEKLY,
    { variables: { property_ua_id: ua_id } }
  );

  if (error) {
    return (
      <NotFound title="Error fetching data">
        <p>Your data was not found</p>
      </NotFound>
    );
  }

  if (loading) {
    return null;
  }

  let weeklyOutputs;
  let dailyOutputs;
  let hourlyOutputs;
  if (
    data &&
    data.getExecWeeklyData &&
    data.getExecDailyData &&
    data.getExecHourlyData
  ) {
    const weeklyResult = data.getExecWeeklyData;
    const dailyResult = data.getExecDailyData;
    const hourlyResult = data.getExecHourlyData;

    const weeklyTypeName = data.getExecWeeklyData.__typename;
    const dailyTypeName = data.getExecDailyData.__typename;
    const hourlyTypeName = data.getExecHourlyData.__typename;

    switch (weeklyTypeName) {
      case "ExecWeeklyArray":
        const data = weeklyResult as ExecData_getExecWeeklyData_ExecWeeklyArray;
        weeklyOutputs = data;
        break;

      default:
        return (
          <NotFound title="Error fetching data">
            <p>Your data was not found</p>
          </NotFound>
        );
    }

    switch (dailyTypeName) {
      case "ExecDailyArray":
        const data = dailyResult as ExecData_getExecDailyData_ExecDailyArray;
        dailyOutputs = data;
        break;
      default:
        return (
          <NotFound title="Error fetching data">
            <p>Your data was not found</p>
          </NotFound>
        );
    }

    switch (hourlyTypeName) {
      case "ExecHourlyArray":
        const data = hourlyResult as ExecData_getExecHourlyData_ExecHourlyArray;
        hourlyOutputs = data;
        break;
      default:
        return (
          <NotFound title="Error fetching data">
            <p>Your data was not found</p>
          </NotFound>
        );
    }

    if (!dailyOutputs || !weeklyOutputs) {
      return (
        <NotFound title="Error fetching data">
          <p>Your data was not found</p>
        </NotFound>
      );
    } else {
      return (
        <SnapshotLanding
          weeklyData={weeklyOutputs}
          dailyData={dailyOutputs}
          hourlyData={hourlyOutputs}
          ua_id={ua_id}
          timePeriod={timePeriod || "weekly"}
        />
      );
    }
  }
};
