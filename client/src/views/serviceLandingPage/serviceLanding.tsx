import React, { useState } from "react";

import SEO from "../seo";
import AdminLayout from "../../components/layouts/AdminLayout";
import { GetProperty_getProperty_Property } from "../../graphql/GetProperty";

import ServiceBanner from "../../components/blocks/service-banner";
import { Link } from "react-router-dom";
import { AuDirectionLink, Aubtn } from "../../types/auds";
import { ServiceQuestions } from "./cardlistQuestions";
import AskQuestionBlock from "../../components/blocks/ask-question";
import questionImage from "./question.png";
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

            <h2 className="mt-1">{property.service_name}</h2>
          </>
        </ServiceBanner>
        <div className="au-body au-body--alt">
          <div className="container-fluid">
            <div role="tablist">
              <Aubtn
                className="border-right-0"
                as={questionView ? "primary" : "secondary"}
                onClick={handleViewChange}
                role="tab"
                aria-selected={questionView}
              >
                Questions
              </Aubtn>
              <Aubtn
                as={questionView ? "secondary" : "primary"}
                className="border-left-0"
                onClick={handleViewChange}
                role="tab"
                aria-selected={!questionView}
              >
                Metrics
              </Aubtn>
            </div>

            {questionView ? <ServiceQuestions /> : <MetricsView />}

            <h2>Have a question that isn't listed?</h2>
            <div className="row mt-1">
              <div className="col-md-8 col-sm-12">
                <AskQuestionBlock />
              </div>
              <div className="col-md-3 col-sm-none">
                <img src={questionImage} alt="" className="question-image" />
              </div>
            </div>
          </div>
        </div>
      </>
    </AdminLayout>
  );
};
