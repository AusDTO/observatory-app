import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps, Router, Redirect } from "react-router-dom";
import SEO from "../seo";
import confirmationImg from "./confirmation.png";

interface Props extends RouteComponentProps {}

export const PasswordResetEmailSent: React.FC<Props> = ({
  history,
  location,
}) => {
  if (!location.state) {
    return <Redirect to="/" />;
  }
  let { email } = location.state as any;

  if (!email) {
    return <Redirect to="/forgot-password" />;
  }

  return (
    <DefaultLayout>
      <>
        <SEO title="Confirm registration" />

        <div className="container-fluid au-body">
          <h2>Check your email</h2>
          <p>
            We have sent a confirmation to your email <code>{email}</code>.
            Click the link in the email to reset your password.
          </p>
        </div>
      </>
    </DefaultLayout>
  );
};
