import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import SEO from "../seo";

interface Props extends RouteComponentProps {}

export const MePage: React.FC<Props> = ({ history, location }) => {
  return (
    <DefaultLayout>
      <>
        <SEO title="Me" />

        <div className="container-fluid au-body">
          <h2>Log in successful</h2>
        </div>
      </>
    </DefaultLayout>
  );
};
