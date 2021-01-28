import React from "react";
import Loader from "react-loader-spinner";
import { RouteComponentProps, withRouter } from "react-router-dom";
import MetricCard from "../../components/blocks/metric-card";
import PageAlert from "../../components/blocks/page-alert";
import { Table } from "../../components/blocks/table/table";
import { shortenString } from "../../components/blocks/table/utility";
import AdminLayout from "../../components/layouts/AdminLayout";
import { formatHour } from "../../components/recharts/formatters/dateTickFormatter";
import { ObjectStringToInt } from "../../components/recharts/formatters/stringToNumber";
import { LineChartVis } from "../../components/recharts/timeSeries";
import { getDayFromDate } from "../../components/util/dateFormatters";
import {
  roundTwoPlaces,
  secondsToMinutes,
} from "../../components/util/numberUtils";
import {
  PeakDemand_getPeakDemandData_PeakDemandData,
  PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData,
} from "../../graphql/PeakDemand";
import { AuCard, AuCardInner, AuCardTitle } from "../../types/auds";
import SEO from "../seo";

interface Props extends RouteComponentProps {
  peakTimeSeriesData?: PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData;
  peakDemandData?: PeakDemand_getPeakDemandData_PeakDemandData;
  isLoading?: boolean;
  errorMessage?: string;
}

const PeakDemandView: React.FC<Props> = ({
  history,
  location,
  isLoading,
  errorMessage,
  peakTimeSeriesData,
  peakDemandData,
}) => {
  return (
    <AdminLayout>
      <>
        <SEO title="Peak Demand" />
        <div className="container-fluid au-body">
          <h1 className="mt-0">Is there a peak demand time for my service?</h1>

          {/* "Is there a peak?" card section */}
          {errorMessage && (
            <PageAlert type="error" className="max-42">
              <>
                <h3>There was an error</h3>
                <p>{errorMessage}</p>
              </>
            </PageAlert>
          )}
          {isLoading ? (
            <div className="flex flex-jc-center mt-2">
              <Loader
                type="Bars"
                color="#046b99"
                height={150}
                width={150}
                timeout={5000} //3 secs
              />
            </div>
          ) : peakTimeSeriesData &&
            peakTimeSeriesData.output &&
            peakDemandData ? (
            <>
              <h2>Is there a peak during the last week?</h2>
              <div className="row mt-1">
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Peak Time"
                    content={
                      <>
                        <p>{getDayFromDate(peakDemandData.lastDay)}</p>
                        <p>{formatHour(peakDemandData.visit_hour)}</p>
                      </>
                    }
                  />
                </div>
                <div className="col-md-8 col-sm-6 col-xs-12">
                  <AuCard>
                    <AuCardInner>
                      <Table
                        data={peakDemandData.referral}
                        caption="Site traffic sources"
                        columns={[
                          {
                            Header: "Traffic source",
                            accessor: "peakTraffic",
                            disableSortBy: true,
                            Cell: (props) => {
                              return <span>{props.value}</span>;
                            },
                          },
                          {
                            Header: () => (
                              <span className="align-right">Views</span>
                            ),
                            accessor: "peakCount",
                            Cell: ({ value }) => (
                              <span className="align-right">{value}</span>
                            ),
                          },
                        ]}
                      ></Table>
                    </AuCardInner>
                  </AuCard>
                </div>
              </div>

              {/* "What does the peak look like?" card section */}
              <div className="row mt-1">
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Sessions"
                    metric={peakDemandData.sessions}
                  />
                </div>
                <div className="col-md-8 col-sm-6 col-xs-12">
                  <AuCard>
                    <AuCardTitle
                      level="4"
                      className="font-weight-500 mt-1 ml-1"
                    >
                      Sessions
                    </AuCardTitle>
                    <LineChartVis
                      data={ObjectStringToInt(
                        peakTimeSeriesData.output,
                        "sessions"
                      )}
                      xKey={"visit_hour"}
                      yKey="sessions"
                    ></LineChartVis>
                  </AuCard>
                </div>
              </div>
              <div className="row mt-1">
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Pageviews"
                    metric={peakDemandData.pageViews}
                  />
                </div>
                <div className="col-md-8 col-sm-6 col-xs-12">
                  <AuCard>
                    <AuCardTitle
                      level="4"
                      className="font-weight-500 mt-1 ml-1"
                    >
                      Pageviews
                    </AuCardTitle>
                    <LineChartVis
                      data={ObjectStringToInt(
                        peakTimeSeriesData.output,
                        "pageViews"
                      )}
                      xKey={"visit_hour"}
                      yKey="pageViews"
                    ></LineChartVis>
                  </AuCard>
                </div>
              </div>

              {/* "What are site visitors doing during the peak period?" card section */}
              <h2>What are site visitors doing during the peak period?</h2>
              <div className="row mt-1">
                <div className="col-md-6 col-sm-6 col-xs-12">
                  <AuCard>
                    <AuCardInner>
                      <Table
                        data={peakDemandData.top10}
                        caption="Pages visited during peak"
                        columns={[
                          {
                            Header: "Page url",
                            accessor: "pageTitle",
                            disableSortBy: true,
                            Cell: ({ value, row }) => {
                              const rowData = row as any;
                              return (
                                <a
                                  href={`${rowData.original.pageUrl}`}
                                  title={value}
                                  target="blank"
                                  rel="noopener noreferrer"
                                >
                                  {shortenString(value, 35)}
                                </a>
                              );
                            },
                          },
                          {
                            Header: () => (
                              <span className="align-right">Views</span>
                            ),
                            accessor: "pageCount",
                            Cell: ({ value }) => (
                              <span className="align-right">{value}</span>
                            ),
                          },
                        ]}
                      ></Table>
                    </AuCardInner>
                  </AuCard>
                </div>
                <div className="col-md-6 col-sm-6 col-xs-12">
                  <div className="row">
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <MetricCard
                        level="3"
                        title="Pages per Session"
                        metric={roundTwoPlaces(peakDemandData.pagesPerSession)}
                      />
                    </div>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <MetricCard
                        level="3"
                        title="Avg. Session Duration"
                        metric={secondsToMinutes(
                          peakDemandData.aveSessionDuration
                        )}
                      />
                    </div>
                  </div>
                  <div className="row mt-1">
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <MetricCard
                        level="3"
                        title="Avg. Time on Page"
                        metric={secondsToMinutes(peakDemandData.timeOnPage)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </>
    </AdminLayout>
  );
};
export default withRouter(PeakDemandView);
