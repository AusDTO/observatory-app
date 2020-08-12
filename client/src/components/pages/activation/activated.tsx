import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import SEO from "../seo";
import { AuCtaLink } from "../../../types/auds";
import welcomeImg from "./welcome.png";

interface Props extends RouteComponentProps {}

export const Activated: React.FC<Props> = () => {
  return (
    <DefaultLayout>
      <>
        <SEO title="Account activated!" />

        <div className="container-fluid au-body">
          <h2>Welcome!</h2>
          <p>Congratulations, your account has been activated.</p>
          <p>
            <AuCtaLink
              link="/login"
              text="Sign in"
              className="mt-1 inline-block"
            ></AuCtaLink>
          </p>
          <img src={welcomeImg} alt="" className="mt-2" />
        </div>
      </>
    </DefaultLayout>
  );
};
