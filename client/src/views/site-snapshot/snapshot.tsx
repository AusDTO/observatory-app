import React, { useState } from "react";
import SEO from "../seo";
import AdminLayout from "../../components/layouts/AdminLayout";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";

import {
  Aubtn,
  AuCard,
  AuCardInner,
  AuCardTitle,
  AuFormGroup,
  AuInpageNavSection,
} from "../../types/auds";
import MetricCard from "../../components/blocks/metric-card";
import { stringNumToCommaSeperated } from "../../components/util/stringNumToCommaSeperated";
import {
  ExecData_getExecDailyData_ExecDailyArray,
  ExecData_getExecWeeklyData_ExecWeeklyArray,
} from "../../graphql/ExecData";
import { LineChartVis } from "../../components/recharts/timeSeries";
import * as _ from "lodash";
import { ObjectStringToInt } from "../../components/recharts/formatters/stringToNumber";
import { Table } from "../../components/blocks/table/table";
import { numberWithCommas } from "../../components/blocks/table/utility";
import { Formik, Form } from "formik";
import TextField from "../../components/form/TextField";
import { InitialValues, validationSchema } from "../register/register_schema";
import RadioField from "../../components/form/RadioField";
import { Glossary } from "./glossary";

interface Props extends RouteComponentProps {
  weeklyData: ExecData_getExecWeeklyData_ExecWeeklyArray;
  dailyData: ExecData_getExecDailyData_ExecDailyArray;
  ua_id: string;
}

const SnapshotLanding: React.FC<Props> = ({
  weeklyData,
  dailyData,
  ua_id,
  history,
}) => {
  const handleSelection = () => {
    console.log("hello");
  };
  return (
    <AdminLayout>
      <>
        <SEO title="Snapshot" />
        <div className="container-fluid au-body snapshot">
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

          <Formik
            initialValues={InitialValues}
            onSubmit={(data, errors) => {
              handleSelection();
            }}
          >
            {({ values, errors, touched, handleSubmit, submitForm }) => (
              <Form
                noValidate
                onChange={(e) => {
                  const a = e as any;
                  // handleSubmit(e);
                  console.log(a.target.value);
                  history.push(
                    `${window.location.pathname}?timePeriod=${a.target.value}`
                  );
                }}
              >
                <RadioField
                  id="time-period"
                  legend="Select time period"
                  options={[
                    {
                      label: "weekly",
                      value: "weekly",
                      defaultChecked: true,
                    },
                    {
                      label: "daily",
                      value: "daily",
                      defaultChecked: false,
                    },
                    {
                      label: "weasdfdsaf",
                      value: "asdsa",
                    },
                  ]}
                />
              </Form>
            )}
          </Formik>

          <section className="mt-2">
            <h3 id="page-views-section">How many views is our site getting?</h3>
            <div className="row mt-1">
              <div className="col-md-4 col-sm-6 col-xs-12">
                <MetricCard
                  title="Pageviews"
                  level="4"
                  metric={stringNumToCommaSeperated(
                    weeklyData.output[0].pageViews
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
                    data={ObjectStringToInt(dailyData.output, "pageViews")}
                    xKey="date"
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
                  link={weeklyData.output[0].topTen[0].pageUrl}
                  linkText={weeklyData.output[0].topTen[0].pageTitle}
                  metric={stringNumToCommaSeperated(
                    weeklyData.output[0].topTen[0].pageViews
                  )}
                />
              </div>
              <div className="col-md-8">
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
                              <a href={rowData.original.pageUrl} title={value}>
                                {`${
                                  value.length > 20
                                    ? value.substring(0, 20) + "..."
                                    : value
                                }`}
                              </a>
                            );
                          },
                        },
                        { Header: "Rank", accessor: "rank" },
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
                          Cell: ({ value }) => (
                            <span className="align-right">{value}</span>
                          ),
                        },
                      ]}
                      data={weeklyData.output[0].topTen}
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
                  link={weeklyData.output[0].topTenGrowth[0].pageUrl}
                  linkText={weeklyData.output[0].topTenGrowth[0].pageTitle}
                  metric={stringNumToCommaSeperated(
                    weeklyData.output[0].topTenGrowth[0].pageViews
                  )}
                />
              </div>
              <div className="col-md-8">
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
                              <a href={rowData.pageUrl} title={value}>
                                {`${
                                  value.length > 20
                                    ? value.substring(0, 20) + "..."
                                    : value
                                }`}
                              </a>
                            );
                          },
                        },
                        { Header: "Rank", accessor: "rank" },
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
                          Cell: ({ value }) => (
                            <span className="align-right">{value}</span>
                          ),
                        },
                      ]}
                      data={weeklyData.output[0].topTenGrowth}
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
                  defLinkId="sessions-card"
                  defLink="#sessions-def"
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
              <div className="col-md-8 col-sm-12 col-xs-12">
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
          <Glossary />
        </div>
      </>
    </AdminLayout>
  );
};

export default withRouter(SnapshotLanding);
