import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import MetricCard from "../../components/blocks/metric-card";
import AdminLayout from "../../components/layouts/AdminLayout";
import SEO from "../seo";

interface Props extends RouteComponentProps {}

const PeakDemand: React.FC<Props> = ({ history, location }) => {
  return (
    <AdminLayout>
      <>
        <SEO title="Peak Demand" />
        <div className="container-fluid au-body">
          <h1 className="mt-0">Is there a peak demand time for my service?</h1>

          {/* "Is there a peak?" card section */}
          <h2>Is there a peak?</h2>
          <div className="row mt-1">
            <div className="col-md-4 col-sm-6 col-xs-12">
              <MetricCard level="3" title="Peak Time" metric={"TBA"} />
            </div>
            <div className="col-md-8 col-sm-6 col-xs-12">
              <MetricCard
                level="3"
                title="Site Traffic Sources"
                leftAlignMetric={true}
                content={"TBA"}
              />
            </div>
          </div>

          {/* "What does the peak look like?" card section */}
          <h2>What does the peak look like?</h2>
          <div className="row mt-1">
            <div className="col-md-4 col-sm-6 col-xs-12">
              <MetricCard level="3" title="Sessions" metric={"TBA"} />
            </div>
            <div className="col-md-8 col-sm-6 col-xs-12">
              <MetricCard
                level="3"
                title="Sessions"
                leftAlignMetric={true}
                content={"Graph"}
              />
            </div>
          </div>
          <div className="row mt-1">
            <div className="col-md-4 col-sm-6 col-xs-12">
              <MetricCard level="3" title="Pageviews" metric={"TBA"} />
            </div>
            <div className="col-md-8 col-sm-6 col-xs-12">
              <MetricCard
                level="3"
                title="Views"
                leftAlignMetric={true}
                content={"Graph"}
              />
            </div>
          </div>

          {/* "What are site visitors doing during the peak period?" card section */}
          <h2>What are site visitors doing during the peak period?</h2>
          <div className="row mt-1">
            <div className="col-md-4 col-sm-6 col-xs-12">
              <MetricCard
                level="3"
                title="Top Pages Viewed"
                content={
                  <div>
                    TBA
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                  </div>
                }
              />
            </div>
            <div className="col-md-8 col-sm-6 col-xs-12">
              <div className="row">
                <div className="col-md-6 col-sm-6 col-xs-12">
                  <MetricCard level="3" title="Avg. Sessions" metric={"TBA"} />
                </div>
                <div className="col-md-6 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Pages per Session"
                    metric={"TBA"}
                  />
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-md-6 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Avg. Session Duration"
                    metric={"TBA"}
                  />
                </div>
                <div className="col-md-6 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Avg. Time on Page"
                    metric={"TBA"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};
export default withRouter(PeakDemand);
