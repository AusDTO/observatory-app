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
          <h1>Welcome back</h1>

          {/* <Link to="/register">
            <Aubtn className="mt-1"> Get started</Aubtn>
          </Link> */}
          <h2>Choose a service</h2>
          <ul>
            <li>
              <a href="">Design System</a>
            </li>
            <li>
              <a href="">Observatory</a>
            </li>
            <li>
              <a href="">Hello</a>
            </li>
          </ul>
          <h2>Manage Account </h2>
          <ul>
            <li>
              <a href="">Change password</a>
            </li>
            <li>
              <a href="">Update details</a>
            </li>
          </ul>
        </div>
      </>
    </AdminLayout>
  );
};
