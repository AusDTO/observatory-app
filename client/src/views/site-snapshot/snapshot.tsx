import React, { useState } from "react";
import SEO from "../seo";
import AdminLayout from "../../components/layouts/AdminLayout";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import {
  AuCard,
  AuCardInner,
  AuCardTitle,
  AuFieldset,
  AuLegend,
  AuRadio,
} from "../../types/auds";
import MetricCard from "../../components/blocks/metric-card";
import {
  roundTwoPlaces,
  secondsToMinutes,
  stringNumToCommaSeperated,
} from "../../components/util/numberUtils";
import {
  ExecData_getExecDailyData_ExecDailyArray,
  ExecData_getExecHourlyData_ExecHourlyArray,
  ExecData_getExecWeeklyData_ExecWeeklyArray,
} from "../../graphql/ExecData";
import { LineChartVis } from "../../components/recharts/timeSeries";
import * as _ from "lodash";
import {
  ObjectStringToInt,
  ScaleSecondsToMins,
} from "../../components/recharts/formatters/stringToNumber";
import { Table } from "../../components/blocks/table/table";
import {
  numberWithCommas,
  shortenString,
} from "../../components/blocks/table/utility";

import { Glossary } from "./glossary";
import { percentageWithSign } from "../../components/util/percentageSign";
import moment from "moment";
import { DurationVis } from "../../components/recharts/timeSeriesDuration";

interface Props extends RouteComponentProps {
  weeklyData: ExecData_getExecWeeklyData_ExecWeeklyArray;
  dailyData: ExecData_getExecDailyData_ExecDailyArray;
  hourlyData: ExecData_getExecHourlyData_ExecHourlyArray;
  timePeriod: string;
  ua_id: string;
}

const SnapshotLanding: React.FC<Props> = ({
  weeklyData,
  dailyData,
  hourlyData,
  timePeriod,
  ua_id,
  history,
}) => {
  const cardData = timePeriod === "daily" ? dailyData : weeklyData;
  const graphData = timePeriod === "daily" ? hourlyData : dailyData;

  return (
    <AdminLayout>
      <>
        <SEO title="Snapshot" />
        <div className="container-fluid au-body snapshot" id="top">
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

          <AuFieldset className="mt-2">
            <AuLegend>Select your time period</AuLegend>
            <AuRadio
              label="Last 7 days"
              value="weekly"
              name="form"
              id="weekly_radio"
              defaultChecked={timePeriod != "daily"}
              onChange={(e: any) => {
                history.push(
                  `${window.location.pathname}?timePeriod=${e.target.value}`
                );
              }}
            />
            <AuRadio
              label="Last 24 hours"
              value="daily"
              name="form"
              id="daily_radio"
              defaultChecked={timePeriod === "daily"}
              onChange={(e: any) => {
                history.push(
                  `${window.location.pathname}?timePeriod=${e.target.value}`
                );
              }}
            />
          </AuFieldset>

          <section className="mt-2">
            <h3 id="page-views-section">How many views is our site getting?</h3>
            <div className="row mt-1">
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Pageviews"
                  level="4"
                  metric={stringNumToCommaSeperated(
                    cardData.output[0].pageViews
                  )}
                  defLink="#pageviews-def"
                  defLinkId="pageviews-card"
                />
              </div>
              <div className="col-md-8 col-sm-12 col-xs-12">
                <AuCard>
                  <AuCardTitle level="4" className="font-weight-500 mt-1 ml-1">
                    PageViews
                  </AuCardTitle>
                  <LineChartVis
                    data={ObjectStringToInt(
                      graphData.output,
                      "pageViews"
                    ).reverse()}
                    xKey={timePeriod === "daily" ? "visit_hour" : "date"}
                    yKey="pageViews"
                  ></LineChartVis>
                </AuCard>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Most viewed page"
                  level="4"
                  link={cardData.output[0].topTenPageViews[0].pageUrl}
                  linkText={shortenString(
                    cardData.output[0].topTenPageViews[0].pageTitle,
                    25
                  )}
                  metric={stringNumToCommaSeperated(
                    cardData.output[0].topTenPageViews[0].pageViews
                  )}
                />
              </div>
              <div className="col-md-8 col-sm-12 col-xs-12">
                <AuCard>
                  <AuCardInner>
                    <Table
                      caption="Top 10 most viewed pages"
                      columns={[
                        {
                          Header: "Page",
                          accessor: "pageTitle",
                          disableSortBy: true,
                          Cell: ({ value, row }) => {
                            const rowData = row as any;
                            return (
                              <a
                                href={rowData.original.pageUrl}
                                title={value}
                                target="blank"
                                rel="noopener noreferrer"
                              >
                                {shortenString(value, 20)}
                              </a>
                            );
                          },
                        },
                        {
                          Header: () => (
                            <span className="align-right">Rank</span>
                          ),
                          accessor: "rank",
                          Cell: ({ value }) => (
                            <span className="align-right">{value}</span>
                          ),
                        },
                        {
                          Header: () => (
                            <span className="align-right">Page Views</span>
                          ),
                          accessor: "pageViews",
                          Cell: ({ value }) => (
                            <span className="align-right">
                              {numberWithCommas(value)}
                            </span>
                          ),
                        },
                        {
                          Header: () => (
                            <span className="align-right">Percentage (%)</span>
                          ),
                          accessor: "percentage",
                          Cell: ({ value }) => {
                            let d: string = value;

                            return (
                              <span className="percentage-cell">
                                <span className="percentage-cell__inner">
                                  {percentageWithSign(d)}
                                </span>
                              </span>
                            );
                          },
                        },
                      ]}
                      data={cardData.output[0].topTenPageViews}
                    />
                  </AuCardInner>
                </AuCard>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Page with largest growth in views"
                  level="4"
                  link={cardData.output[0].topTenGrowth[0].pageUrl}
                  linkText={shortenString(
                    cardData.output[0].topTenGrowth[0].pageTitle,
                    25
                  )}
                  metric={stringNumToCommaSeperated(
                    cardData.output[0].topTenGrowth[0].pageViews
                  )}
                />
              </div>
              <div className="col-md-8 col-sm-12 col-xs-12">
                <AuCard>
                  <AuCardInner>
                    <Table
                      caption="Top 10 pages with largest growth in views"
                      columns={[
                        {
                          Header: "Page",
                          accessor: "pageTitle",
                          disableSortBy: true,
                          Cell: ({ value, row: { original } }) => {
                            const rowData = original as any;
                            return (
                              <a
                                href={rowData.pageUrl}
                                title={value}
                                target="blank"
                                rel="noopener noreferrer"
                              >
                                {shortenString(value, 20)}
                              </a>
                            );
                          },
                        },
                        {
                          Header: () => (
                            <span className="align-right">Rank</span>
                          ),
                          accessor: "rank",
                          Cell: ({ value }) => (
                            <span className="align-right">{value}</span>
                          ),
                        },
                        {
                          Header: () => (
                            <span className="align-right">Page Views</span>
                          ),
                          accessor: "pageViews",
                          Cell: ({ value }) => (
                            <span className="align-right">
                              {numberWithCommas(value)}
                            </span>
                          ),
                        },
                        {
                          Header: () => (
                            <span className="align-right">
                              Percentage increase
                            </span>
                          ),
                          accessor: "percentage",
                          Cell: ({ value }) => (
                            <span className="align-right">{value}</span>
                          ),
                        },
                      ]}
                      data={cardData.output[0].topTenGrowth}
                    />
                  </AuCardInner>
                </AuCard>
              </div>
            </div>
          </section>

          <section>
            <h3>
              {/* FIX should automatically create linked headings*/}
              How many visitors came, and how many were coming for the first
              time?
            </h3>
            <div className="row mt-1">
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Users"
                  level="4"
                  defLink="#users-def"
                  defLinkId="users-card"
                  metric={stringNumToCommaSeperated(cardData.output[0].users)}
                />
              </div>
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="New users"
                  level="4"
                  metric={stringNumToCommaSeperated(
                    cardData.output[0].newUsers
                  )}
                />
              </div>

              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Returning users"
                  level="4"
                  metric={stringNumToCommaSeperated(
                    cardData.output[0].returningUsers
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
                    cardData.output[0].aveSessionsPerUser
                  )}
                  defLinkId="sessions-card"
                  defLink="#sessions-def"
                />
              </div>
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Pages per session"
                  level="4"
                  metric={stringNumToCommaSeperated(
                    cardData.output[0].pagesPerSession
                  )}
                />
              </div>
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Average time on page"
                  defLinkId="time-card"
                  defLink="#time-on-page-def"
                  level="4"
                  metric={secondsToMinutes(cardData.output[0].timeOnPage)}
                />
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Average session duration"
                  level="4"
                  metric={secondsToMinutes(
                    cardData.output[0].aveSessionDuration
                  )}
                />
              </div>
              <div className="col-md-8 col-sm-12 col-xs-12">
                <AuCard>
                  <AuCardTitle level="4" className="font-weight-500 mt-1 ml-1">
                    Average session duration
                  </AuCardTitle>
                  <DurationVis
                    data={ScaleSecondsToMins(
                      graphData.output,
                      "aveSessionDuration"
                    ).reverse()}
                    xKey={timePeriod === "daily" ? "visit_hour" : "date"}
                    yKey="aveSessionDuration"
                  ></DurationVis>
                </AuCard>
              </div>
            </div>
          </section>
          <Glossary />
        </div>
      </>
    </AdminLayout>
  );
};

export default withRouter(SnapshotLanding);
