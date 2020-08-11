import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import SEO from "../seo";

interface Props extends RouteComponentProps {}

export const Activated: React.FC<Props> = () => {
  return (
    <DefaultLayout>
      <>
        <SEO title="Account activated!" />

        <div className="container-fluid au-body">
          <p>Congratulations, your account has been activated.</p>
        </div>
      </>
    </DefaultLayout>
  );
};
