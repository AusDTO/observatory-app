import React from "react";
import { RouteComponentProps } from "react-router-dom";
import PeakDemand from "../../views/peakDemand/peakDemand";

interface Props extends RouteComponentProps<{ ua_id: string }> {} // key

export const PeakDataController: (arg0: Props) => any = ({ match }) => {
  const { ua_id } = match.params;

  return <PeakDemand />;
};
