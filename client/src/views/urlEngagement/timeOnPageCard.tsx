import React from "react";
import { Link } from "react-router-dom";
import { secondsToMinutes } from "../../components/util/numberUtils";

interface Props {
  timeOnPage: string;
}
export const TimeOnPageCardContent: React.FC<Props> = ({ timeOnPage }) => {
  return (
    <>
      <p>
        The average time on page for this url is{" "}
        <strong>{secondsToMinutes(timeOnPage)}</strong>.
      </p>
      <p>
        Our analysis indicates that this is a{" "}
        {parseInt(timeOnPage) > 90 ? (
          <Link to="/metrics/time-on-page">content oriented</Link>
        ) : (
          <Link to="/metrics/time-on-page">action oriented</Link>
        )}{" "}
        page.
      </p>
    </>
  );
};
