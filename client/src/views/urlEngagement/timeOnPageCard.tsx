import React from "react";
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
        <a href="/metrics/time-on-page">
          {parseInt(timeOnPage) > 90 ? "content-oriented" : "action-oriented"}
        </a>{" "}
        {/** TO FIX: USE LINK */}
        page.
      </p>
    </>
  );
};
