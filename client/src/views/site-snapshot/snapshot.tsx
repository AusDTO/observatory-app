import React, { useState } from "react";
import SEO from "../seo";
import AdminLayout from "../../components/layouts/AdminLayout";
import { Link } from "react-router-dom";

import { AuCard, AuCardTitle } from "../../types/auds";
import MetricCard from "../../components/blocks/metric-card";
import { stringNumToCommaSeperated } from "../../components/util/stringNumToCommaSeperated";
import {
  ExecData_getExecDailyData_ExecDailyArray,
  ExecData_getExecWeeklyData_ExecWeeklyArray,
} from "../../graphql/ExecData";
import { LineChartVis } from "../../components/recharts/timeSeries";
import * as _ from "lodash";
import { ObjectStringToInt } from "../../components/recharts/formatters/stringToNumber";

interface Props {
  weeklyData: ExecData_getExecWeeklyData_ExecWeeklyArray;
  dailyData: ExecData_getExecDailyData_ExecDailyArray;
  ua_id: string;
}

export const SnapshotLanding: React.FC<Props> = ({
  weeklyData,
  dailyData,
  ua_id,
}) => {
  return (
    <AdminLayout>
      <>
        <SEO title="Snapshot" />
        <div className="container-fluid au-body">
          <Link
            to={`/service/${ua_id}`}
            className="au-direction-link inline-block mt-1"
          >
            <span
              className="au-direction-link__arrow au-direction-link__arrow--left"
              aria-hidden="true"
            ></span>
            Back
          </Link>
          <h1 className="mt-1">What's a snapshot of our site?</h1>
          <section className="mt-2">
            <h3>How many views is our site getting?</h3>
            <div className="row mt-1">
              <div className="">
                <div className="col-md-4 col-sm-6">
                  <MetricCard
                    title="Pageviews"
                    level="4"
                    metric={stringNumToCommaSeperated(
                      weeklyData.output[0].pageViews
                    )}
                  />
                </div>
                <div className="col-md-8 col-sm-12">
                  <AuCard>
                    <AuCardTitle
                      level="4"
                      className="font-weight-500 mt-1 ml-1"
                    >
                      PageViews
                    </AuCardTitle>
                    <LineChartVis
                      data={ObjectStringToInt(dailyData.output, "pageViews")}
                      xKey="date"
                      yKey="pageViews"
                    ></LineChartVis>
                  </AuCard>
                </div>
              </div>
            </div>

            <div className="row mt-1">
              <div className="col-md-4 col-sm-6">
                <MetricCard
                  title="Most viewed page"
                  level="4"
                  link="#"
                  linkText="Page title"
                  metric={stringNumToCommaSeperated(
                    weeklyData.output[0].pageViews
                  )}
                />
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-md-4 col-sm-6">
                <MetricCard
                  title="Page with largest growth in views"
                  level="4"
                  metric={stringNumToCommaSeperated(
                    weeklyData.output[0].pageViews
                  )}
                />
              </div>
            </div>
          </section>

          <section>
            <h3>
              How many visitors came, and how many were coming for the first
              time?
            </h3>
            <div className="row mt-1">
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Users"
                  level="4"
                  metric={stringNumToCommaSeperated(weeklyData.output[0].users)}
                />
              </div>
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="New users"
                  level="4"
                  metric={stringNumToCommaSeperated(
                    weeklyData.output[0].newUsers
                  )}
                />
              </div>

              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Returning users"
                  level="4"
                  metric={stringNumToCommaSeperated(
                    weeklyData.output[0].returningUsers
                  )}
                />
              </div>
            </div>
          </section>
          <section>
            <h3>What did the average visit look like?</h3>
            <div className="row mt-1">
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Average sessions"
                  level="4"
                  metric={stringNumToCommaSeperated(
                    weeklyData.output[0].aveSessionsPerUser
                  )}
                />
              </div>
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Pages per session"
                  level="4"
                  metric={stringNumToCommaSeperated(
                    weeklyData.output[0].pagesPerSession
                  )}
                />
              </div>
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Average time on page"
                  level="4"
                  metric={weeklyData.output[0].timeOnPage + "s"}
                />
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Average session duration"
                  level="4"
                  metric={weeklyData.output[0].aveSessionDuration + "s"}
                />
              </div>
              <div className="col-md-8 col-sm-12">
                <AuCard>
                  <AuCardTitle level="4" className="font-weight-500 mt-1 ml-1">
                    Average session duration
                  </AuCardTitle>
                  <LineChartVis
                    data={ObjectStringToInt(
                      dailyData.output,
                      "aveSessionDuration"
                    )}
                    xKey="date"
                    yKey="aveSessionDuration"
                  ></LineChartVis>
                </AuCard>
              </div>
            </div>
          </section>
        </div>
      </>
    </AdminLayout>
  );
};
