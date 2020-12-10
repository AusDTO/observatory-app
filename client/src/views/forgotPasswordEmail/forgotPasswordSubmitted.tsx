import React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import DefaultLayout from "../../components/layouts/DefaultLayout";
import SEO from "../seo";

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
        <SEO title="Check your email" />

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
