import React, { useState } from "react";

import { RouteComponentProps } from "react-router-dom";
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
  const url = params.get("url");
  console.log(url);

  return <EngagementView />;
};
