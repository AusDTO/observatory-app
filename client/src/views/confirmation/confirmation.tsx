import React from "react";
import DefaultLayout from "../../components/layouts/DefaultLayout";
import { RouteComponentProps, Router, Redirect } from "react-router-dom";
import SEO from "../seo";
import confirmationImg from "./confirmation.png";

interface Props extends RouteComponentProps {}

export const Confirmation: React.FC<Props> = ({ history, location }) => {
  if (!location.state) {
    return <Redirect to="/" />;
  }
  let { email, name } = location.state as any;

  if (!email || !name) {
    return <Redirect to="/" />;
  }

  return (
    <DefaultLayout>
      <>
        <SEO title="Confirm registration" />

        <div className="container-fluid au-body">
          <h2>One more step...</h2>
          <p> Hey {name},</p>
          <p>
            We have sent a confirmation to your email <code>{email}</code>. Use
            the link found there to finish signing up.
          </p>
          <div className="row">
            <div className="col-md-6 col-xs-12">
              <img src={confirmationImg}></img>
            </div>
          </div>
        </div>
      </>
    </DefaultLayout>
  );
};
