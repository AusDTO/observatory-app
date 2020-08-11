import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps, Router, Redirect } from "react-router-dom";

interface Props extends RouteComponentProps {}

export const Activated: React.FC<Props> = ({ history, location }) => {
  return (
    <DefaultLayout>
      <div className="container-fluid au-body">
        <p>Congratulations, your account has been activated.</p>
      </div>
    </DefaultLayout>
  );
};
