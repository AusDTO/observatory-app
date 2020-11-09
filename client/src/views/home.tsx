import React from "react";
import DefaultLayout from "../components/layouts/DefaultLayout";
import { RouteComponentProps, Link } from "react-router-dom";
import SEO from "./seo";
import { Aubtn } from "../types/auds";

interface Props extends RouteComponentProps {}

export const Home: React.FC<Props> = ({ history, location }) => {
  return (
    <DefaultLayout>
      <>
        <SEO title="Home" />

        <div className="container-fluid au-body">
          <h1>See your web data differently</h1>
          <p>
            You shouldn't have to be a Data Scientist to use data intelligently.
            So we built ObservatoryApp to flatten the analytics learning curve
            and give you valuable insights in a language you can understand:{" "}
            <i>human.</i>
          </p>
          <Link to="/register">
            <Aubtn className="mt-1">Register</Aubtn>
          </Link>
        </div>
      </>
    </DefaultLayout>
  );
};
