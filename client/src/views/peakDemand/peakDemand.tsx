import React from "react";
import Loader from "react-loader-spinner";
import { RouteComponentProps, withRouter } from "react-router-dom";
import MetricCard from "../../components/blocks/metric-card";
import AdminLayout from "../../components/layouts/AdminLayout";
import { formatHour } from "../../components/recharts/formatters/dateTickFormatter";
import { ObjectStringToInt } from "../../components/recharts/formatters/stringToNumber";
import { LineChartVis } from "../../components/recharts/timeSeries";
import {
  roundTwoPlaces,
  secondsToMinutes,
} from "../../components/util/numberUtils";
import {
  PeakDemand_getPeakDemandData_PeakDemandData,
  PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData,
} from "../../graphql/PeakDemand";
import { AuCard, AuCardTitle } from "../../types/auds";
import SEO from "../seo";

interface Props extends RouteComponentProps {
  peakTimeSeriesData?: PeakDemand_getPeakTimeSeriesData_PeakTimeSeriesData;
  peakDemandData?: PeakDemand_getPeakDemandData_PeakDemandData;
  isLoading?: boolean;
}

const PeakDemandView: React.FC<Props> = ({
  history,
  location,
  isLoading,
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
            peakDemandData &&
            peakDemandData.output ? (
            <>
              <h2>Is there a peak?</h2>
              <div className="row mt-1">
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Peak Time"
                    content={
                      <>
                        <p>{peakDemandData.output[0].lastDay}</p>
                        <p>{formatHour(peakDemandData.output[0].visit_hour)}</p>
                      </>
                    }
                  />
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
              <div className="row mt-1">
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Sessions"
                    metric={peakDemandData.output[0].sessions}
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
                      ).reverse()}
                      xKey={"visitHour"}
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
                    metric={peakDemandData.output[0].pageViews}
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
                      ).reverse()}
                      xKey={"visitHour"}
                      yKey="pageViews"
                    ></LineChartVis>
                  </AuCard>
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
                      <MetricCard
                        level="3"
                        title="Pages per Session"
                        metric={roundTwoPlaces(
                          peakDemandData.output[0].pagesPerSession
                        )}
                      />
                    </div>
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <MetricCard
                        level="3"
                        title="Avg. Session Duration"
                        metric={secondsToMinutes(
                          peakDemandData.output[0].aveSessionDuration
                        )}
                      />
                    </div>
                  </div>
                  <div className="row mt-1">
                    <div className="col-md-6 col-sm-6 col-xs-12">
                      <MetricCard
                        level="3"
                        title="Avg. Time on Page"
                        metric={secondsToMinutes(
                          peakDemandData.output[0].timeOnPage
                        )}
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
