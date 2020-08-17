import React from "react";
import { RouteComponentProps, Router, Redirect, Link } from "react-router-dom";
import SEO from "./seo";
import { Aubtn } from "../../types/auds";
import AdminLayout from "../layouts/AdminLayout";

interface Props extends RouteComponentProps {}

export const TestRoute: React.FC<Props> = () => {
  return (
    <AdminLayout>
      <>
        <SEO title="Home" />

        <div className="container-fluid au-body">
          <h1>PRIVATE</h1>

          <Link to="/register">
            <Aubtn className="mt-1"> Get started</Aubtn>
          </Link>
        </div>
      </>
    </AdminLayout>
  );
};
