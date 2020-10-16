import React, { useState } from "react";
import SEO from "../seo";
import AdminLayout from "../../components/layouts/AdminLayout";
import { Link } from "react-router-dom";
import { GetExecWeekly_getExecWeeklyData_ExecWeeklyArray } from "../../graphql/GetExecWeekly";
import { AuCard, AuCardInner, AuCardTitle } from "../../types/auds";
import MetricCard from "../../components/blocks/metric-card";

interface Props {
  data: GetExecWeekly_getExecWeeklyData_ExecWeeklyArray;
}

export const SnapshotLanding: React.FC<Props> = ({ data }) => {
  return (
    <AdminLayout>
      <>
        <SEO title="Snapshot" />
        <div className="container-fluid au-body">
          <Link to="/" className="au-direction-link inline-block mt-1">
            <span
              className="au-direction-link__arrow au-direction-link__arrow--left"
              aria-hidden="true"
            ></span>
            Back
          </Link>
          <h1>What's a snapshot of our site?</h1>
          <h3>How many views is our site getting?</h3>
          new users
          <div className="row">
            <div className="col-md-3 col-sm-6">
              <MetricCard
                title="Pageviews"
                level="3"
                metric={data.output[0].pageViews}
              />
            </div>
          </div>
          <h3>
            How many visitors came, and how many were coming for the first time?
          </h3>
          <h3>What did the average visit look like?</h3>
        </div>
      </>
    </AdminLayout>
  );
};
