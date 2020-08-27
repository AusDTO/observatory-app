import React from "react";
import DefaultLayout from "../components/layouts/DefaultLayout";
import { RouteComponentProps, Router, Redirect, Link } from "react-router-dom";
import SEO from "./seo";
import { Aubtn } from "../types/auds";

interface Props extends RouteComponentProps {}

export const Home: React.FC<Props> = ({ history, location }) => {
  return (
    <DefaultLayout>
      <>
        <SEO title="Home" />

        <div className="container-fluid au-body">
          <h1>See your data differently</h1>
          <p>
            You shouldn't have to be a Data Scientist to use data intelligently.
            So we built ObservatoryApp to flatten the analytics learning curve
            and give you valuable isights in a language you can understand:{" "}
            <i>human.</i>
          </p>
          <Link to="/register">
            <Aubtn className="mt-1"> Get started</Aubtn>
          </Link>
        </div>
      </>
    </DefaultLayout>
  );
};
