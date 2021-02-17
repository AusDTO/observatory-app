import React from "react";
import { TooltipProps } from "recharts";
import { formatDateWithDay, formatHour } from "./dateTickFormatter";

interface Props extends TooltipProps {}

export const AverageSessionToolTip: (props: Props) => JSX.Element = ({
  active,
  payload,
}) => {
  let totalVal: string | number = "";
  let date = "";

  if (payload && payload[0]) {
    totalVal = payload[0].payload.aveSessionDuration;
    date = payload[0].payload.date
      ? formatDateWithDay(payload[0].payload.date)
      : formatHour(payload[0].payload.visit_hour);
  }

  return (
    <>
      {active && (
        <div className="custom-tooltip au-body">
          <p>{date}</p>
          <p>{`${totalVal}mins`}</p>
        </div>
      )}
    </>
  );
};

export const PageViewsTooltip: (props: Props) => JSX.Element = ({
  active,
  payload,
}) => {
  let totalVal: string | number = "";
  let date = "";

  if (payload && payload[0]) {
    totalVal = payload[0].payload.pageViews;
    date = payload[0].payload.date
      ? formatDateWithDay(payload[0].payload.date)
      : formatHour(payload[0].payload.visit_hour);
  }

  return (
    <>
      {active && (
        <div className="custom-tooltip au-body">
          <p>{date}</p>
          <p>{`${totalVal.toLocaleString()} views`}</p>
        </div>
      )}
    </>
  );
};

export const SessionsTooltip: (props: Props) => JSX.Element = ({
  active,
  payload,
}) => {
  let totalVal: string | number = "";
  let date = "";

  if (payload && payload[0]) {
    totalVal = payload[0].payload.sessions;
    date = formatHour(payload[0].payload.visit_hour);
  }

  return (
    <>
      {active && (
        <div className="custom-tooltip au-body">
          <p>{date}</p>
          <p>{`${totalVal.toLocaleString()} sessions`}</p>
        </div>
      )}
    </>
  );
};
