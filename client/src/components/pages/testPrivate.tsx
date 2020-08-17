import React from "react";
import DefaultLayout from "../layouts/DefaultLayout";
import { RouteComponentProps, Router, Redirect, Link } from "react-router-dom";
import SEO from "./seo";
import { Aubtn } from "../../types/auds";

interface Props extends RouteComponentProps {}

export const TestRoute: React.FC<Props> = ({ history, location }) => {
  return (
    <DefaultLayout>
      <>
        <SEO title="Home" />

        <div className="container-fluid au-body">
          <h1>PRIVATE</h1>

          <Link to="/register">
            <Aubtn className="mt-1"> Get started</Aubtn>
          </Link>
        </div>
      </>
    </DefaultLayout>
  );
};
