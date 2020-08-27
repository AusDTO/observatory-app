import React from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import SEO from "../seo";
import AdminLayout from "../../layouts/AdminLayout";

interface Props extends RouteComponentProps<{ uaid: string }> {} // key

export const ServiceLandingPage: React.FC<Props> = () => {
  return (
    <AdminLayout>
      <>
        <SEO title="service page" />

        <div className="container-fluid au-body">
          <h2>Property dashboard</h2>
        </div>
      </>
    </AdminLayout>
  );
};
