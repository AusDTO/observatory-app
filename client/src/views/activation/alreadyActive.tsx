import React from "react";
import DefaultLayout from "../../components/layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import SEO from "../seo";
import { AuCtaLink } from "../../types/auds";

interface Props extends RouteComponentProps {}

export const AlreadyActivated: React.FC<Props> = () => {
  return (
    <DefaultLayout>
      <>
        <SEO title="Already active" />
        <div className="container-fluid au-body">
          <h2>Account already active</h2>
          <p>
            Your account has already been activated. You may have received a
            confirmation email twice. We have deleted the one time activation
            link.
          </p>
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
