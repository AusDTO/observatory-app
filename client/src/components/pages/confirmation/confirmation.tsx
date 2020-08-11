import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps, Router, Redirect } from "react-router-dom";

interface Props extends RouteComponentProps {}

export const Confirmation: React.FC<Props> = ({ history, location }) => {
  if (!location.state) {
    return <Redirect to="/" />;
  }
  const { email, name } = location.state as any;

  if (!email || !name) {
    return <Redirect to="/" />;
  }
  return (
    <DefaultLayout>
      <div className="container-fluid au-body">
        <h2>One more step...</h2>
        We have sent a confirmation to your email. Use the link found there to
        finish signing up.
      </div>
    </DefaultLayout>
  );
};
