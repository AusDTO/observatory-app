import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import SEO from "../seo";
import { AuCtaLink } from "../../../types/auds";

interface Props extends RouteComponentProps {}

export const Activated: React.FC<Props> = () => {
  return (
    <DefaultLayout>
      <>
        <SEO title="Account activated!" />

        <div className="container-fluid au-body">
          <p>Congratulations, your account has been activated.</p>
          <AuCtaLink
            link="/sign-in"
            text="Sign in"
            className="mt-1 inline-block"
          ></AuCtaLink>
        </div>
      </>
    </DefaultLayout>
  );
};
