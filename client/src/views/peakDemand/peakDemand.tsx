import React from "react";
import { RouteComponentProps } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import SEO from "../seo";

interface Props extends RouteComponentProps {}

export const PeakDemand: React.FC<Props> = ({ history, location }) => {
  return (
    <AdminLayout>
      <>
        <SEO title="Peak Demand" />

        <div className="container-fluid au-body">Blah</div>
      </>
    </AdminLayout>
  );
};
