import { Form, Formik } from "formik";
import React from "react";
import Loader from "react-loader-spinner";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import MetricCard from "../../components/blocks/metric-card";
import PageAlert from "../../components/blocks/page-alert";
import { Table } from "../../components/blocks/table/table";
import RadioGroup from "../../components/form/RadioGroup";
import TextField from "../../components/form/TextField";
import AdminLayout from "../../components/layouts/AdminLayout";
import { secondsToMinutes } from "../../components/util/numberUtils";
import { engagementFormSchema } from "../../controller/engagementController/schema";
import { UrlData_getDataFromUrl_UrlDataResult } from "../../graphql/UrlData";
import { Aubtn, AuCard, AuCardInner, AuFormGroup } from "../../types/auds";
import SEO from "../seo";
import { EngagementGlossary } from "./engagementGlossary";
import { TimeOnPageCardContent } from "./timeOnPageCard";

interface Props extends RouteComponentProps {
  isLoading: boolean;
  urlData?: UrlData_getDataFromUrl_UrlDataResult;
  initialUrl?: string;
  timePeriod?: string;
  errorMessage?: string;
  ua_id: string;
}

const EngagementView: React.FC<Props> = ({
  history,
  isLoading,
  initialUrl,
  timePeriod,
  urlData,
  errorMessage,
  ua_id,
}) => {
  // const [url, updateUrl] = useState<string>("hello");

  const initialValues = {
    url: initialUrl || "",
    timePeriod: timePeriod || "",
  };

  return (
    <AdminLayout>
      <>
        <SEO title="Engagement" />

        <div className="container-fluid au-body">
          <Link className="au-direction-link" to={`/service/${ua_id}`}>
            <span
              className="au-direction-link__arrow au-direction-link__arrow--left"
              aria-hidden="true"
            ></span>
            Back
          </Link>
          <h1 className="mt-0">Engagement</h1>

          {errorMessage && (
            <PageAlert type="error" className="max-42">
              <>
                <h3>There was an error</h3>
                <p>{errorMessage}</p>
              </>
            </PageAlert>
          )}
          <Formik
            initialValues={initialValues}
            validateOnBlur
            validateOnChange
            validationSchema={engagementFormSchema}
            onSubmit={(data, { setSubmitting }) => {
              console.log("submitted");
              setSubmitting(true);
              //async call
              history.push(
                `${window.location.pathname}?timePeriod=${data.timePeriod}&url=${data.url}`
              );
              // console.log(data);
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <AuFormGroup>
                  <TextField
                    label="Enter a url"
                    id="url"
                    type="text"
                    className="max-42"
                    hint="Make sure to include the protocol and www, i.e. https://www.dta.gov.au/help-and-advice"
                  />
                </AuFormGroup>
                <AuFormGroup>
                  <RadioGroup
                    legend="Select time period"
                    options={[
                      {
                        value: "weekly",
                        label: "Last week",
                        name: "timePeriod",
                        defaultChecked: timePeriod === "weekly",
                      },
                      {
                        value: "lastday",
                        label: "Last day",
                        name: "timePeriod",
                        defaultChecked: timePeriod === "lastday",
                      },
                    ]}
                  ></RadioGroup>
                </AuFormGroup>
                <AuFormGroup>
                  <Aubtn type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting" : "Submit"}
                  </Aubtn>
                </AuFormGroup>
              </Form>
            )}
          </Formik>

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
          ) : urlData && urlData.output ? (
            <>
              <h2>How long do users spend on this page?</h2>
              <div className="row mt-1">
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Average time on page"
                    metric={secondsToMinutes(urlData.output[0].time_on_page)}
                  />
                </div>
                <div className="col-md-8 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Average time on page"
                    leftAlignMetric={true}
                    content={
                      <TimeOnPageCardContent
                        timeOnPage={urlData.output[0].time_on_page}
                      />
                    }
                  />
                </div>
              </div>
              <h2>Are users coming back to this page?</h2>
              <div className="row mt-1">
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Returning users"
                    metric={urlData.output[0].returning_users}
                  />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="New users"
                    metric={urlData.output[0].new_users}
                  />
                </div>
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <MetricCard
                    level="3"
                    title="Percentage of returning users"
                    metric={`${parseFloat(urlData.output[0].ratio) * 100} %`}
                    outerContent={
                      <p className="mt-1">
                        Our analysis indicates that{" "}
                        {parseFloat(urlData.output[0].ratio) * 100}% of users
                        who visit this page will come back
                      </p>
                    }
                  />
                </div>
              </div>
              <h2>How are users getting to this page?</h2>
              <div className="row mt-1">
                <div className="col-md-6 col-sm-6 col-xs-12">
                  <AuCard>
                    <AuCardInner>
                      <Table
                        data={urlData.output[0].source}
                        caption="Traffic sources"
                        columns={[
                          {
                            Header: "Traffic source",
                            accessor: "source",
                            disableSortBy: true,
                            Cell: (props) => {
                              return <span>{props.value}</span>;
                            },
                          },
                          {
                            Header: () => (
                              <span className="align-right">Views</span>
                            ),
                            accessor: "views",
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
                  <AuCard>
                    <AuCardInner>
                      <Table
                        data={urlData.output[0].medium}
                        caption="Device types"
                        columns={[
                          {
                            Header: "Device",
                            accessor: "medium",
                            disableSortBy: true,
                          },
                          {
                            Header: () => (
                              <span className="align-right">Views</span>
                            ),
                            accessor: "views",
                            Cell: ({ value }) => (
                              <span className="align-right">{value}</span>
                            ),
                          },
                        ]}
                      />
                    </AuCardInner>
                  </AuCard>
                </div>
              </div>
              <EngagementGlossary />
            </>
          ) : (
            <></>
          )}
        </div>
      </>
    </AdminLayout>
  );
};

export default withRouter(EngagementView);
