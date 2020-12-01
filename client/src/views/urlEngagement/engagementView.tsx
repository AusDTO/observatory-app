import { Form, Formik } from "formik";
import React from "react";

import { RouteComponentProps, Link, withRouter } from "react-router-dom";
import MetricCard from "../../components/blocks/metric-card";
import RadioGroup from "../../components/form/RadioGroup";
import TextField from "../../components/form/TextField";
import AdminLayout from "../../components/layouts/AdminLayout";
import { engagementFormSchema } from "../../controller/engagementController/schema";
import { Aubtn, AuFormGroup } from "../../types/auds";
import SEO from "../seo";

interface Props extends RouteComponentProps {}

const EngagementView: React.FC<Props> = ({ history, location }) => {
  return (
    <AdminLayout>
      <>
        <SEO title="Engagement" />

        <div className="container-fluid au-body">
          <h1>Engagement</h1>

          <Formik
            initialValues={{ url: "", timePeriod: "" }}
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
            {({ isSubmitting, values, errors, handleSubmit }) => (
              <Form>
                <AuFormGroup>
                  <TextField
                    label="Enter a url"
                    id="url"
                    type="text"
                    className="max-42"
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
                      },
                      {
                        value: "daily",
                        label: "Last day",
                        name: "timePeriod",
                      },
                    ]}
                  ></RadioGroup>
                </AuFormGroup>
                {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                <pre>{JSON.stringify(errors, null, 2)}</pre>
                <AuFormGroup>
                  <Aubtn type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting" : "Submit"}
                  </Aubtn>
                </AuFormGroup>
              </Form>
            )}
          </Formik>

          <h2>How long do users spend on this page?</h2>
          <div className="row mt-1">
            <div className="col-md-4 col-sm-6 col-xs-12">
              <MetricCard level="3" title="Average time on page" metric="33s" />
            </div>
          </div>
          <h2>Are users coming back to this page?</h2>
          <div className="row mt-1">
            <div className="col-md-4 col-sm-6 col-xs-12">
              <MetricCard level="3" title="Returning users" metric="33s" />
            </div>
            <div className="col-md-4 col-sm-6 col-xs-12">
              <MetricCard
                level="3"
                title="Ratio of page demand"
                metric={<p>hello</p>}
              />
            </div>
          </div>
          <h2>How are users getting to this page?</h2>
          <div className="row mt-1">
            <div className="col-md-4 col-sm-6 col-xs-12">
              <MetricCard level="3" title="Traffic sources" metric="33s" />
            </div>
            <div className="col-md-4 col-sm-6 col-xs-12">
              <MetricCard
                level="3"
                title="Device types"
                metric={<p>hello</p>}
              />
            </div>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};

export default withRouter(EngagementView);
