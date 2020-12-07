import React, { useState } from "react";

import SEO from "../seo";
import AdminLayout from "../../components/layouts/AdminLayout";
import { GetProperty_getProperty_Property } from "../../graphql/GetProperty";

import ServiceBanner from "../../components/blocks/service-banner";
import { Link } from "react-router-dom";
import { ServiceQuestions } from "./cardlistQuestions";
import AskQuestionBlock from "../../components/blocks/leaveFeedback/ask-question";
import questionImage from "./ask.png";
import { MetricsView } from "./metricsView";

interface Props {
  property: GetProperty_getProperty_Property;
}

export const ServiceLandingPage: React.FC<Props> = ({ property }) => {
  const [questionView, setQuestionView] = useState<boolean>(true);
  const handleViewChange = () => {
    setQuestionView(!questionView);
  };
  return (
    <AdminLayout>
      <>
        <SEO title={property.service_name} />

        <ServiceBanner>
          <>
            <Link to="/" className="au-direction-link inline-block mt-1">
              <span
                className="au-direction-link__arrow au-direction-link__arrow--left"
                aria-hidden="true"
              ></span>
              Change service
            </Link>

            <h1 className="mt-1">{property.service_name}</h1>
          </>
        </ServiceBanner>
        <div className="au-body au-body--alt">
          <div className="container-fluid">
            {questionView ? (
              <ServiceQuestions
                propertyUaId={property.ua_id}
                domain={property.domain}
              />
            ) : (
              <MetricsView />
            )}

            <div className="row mt-2">
              <AskQuestionBlock
                label="Let us know what you want to see or how we can make improvements"
                hint="Maximum of 500 characters"
                pageTitle={`${property.service_name} | ObservatoryApp`}
                pageUrl={window.location.href.replace(/(^\w+:|^)\/\//, "")}
                img={questionImage}
                title="Have a question that is not listed? Or feedback about this page?"
              />
            </div>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};
