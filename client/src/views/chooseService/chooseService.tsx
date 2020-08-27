import React, { useState, useEffect, useLayoutEffect } from "react";
import { RouteComponentProps, Router, Redirect, Link } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import SEO from "../seo";
import { gql, useQuery } from "@apollo/client";
import { GET_PROPERTIES_SCHEMA } from "../../controller/chooseServiceController/service_schema";
import { GetProperties_getUserProperties_PropertyList_properties } from "../../graphql/GetProperties";
import PageAlert from "../../components/blocks/page-alert";

interface Props {
  apiMessage?: string;
  properties?: Array<GetProperties_getUserProperties_PropertyList_properties>;
}

export const ChooseServicePage: React.FC<Props> = ({
  apiMessage,
  properties,
}) => {
  const renderProperties = () => {
    if (properties && properties.length > 0) {
      return (
        <ul className="au-link-list">
          {properties.map((property, i) => (
            <li key={i}>
              <Link to={`/service/${property.id}`}>
                {property.service_name}
              </Link>
            </li>
          ))}
        </ul>
      );
    }

    if (apiMessage) {
      return (
        <PageAlert type="warning" className="max-42">
          <>
            <h3>Properties not found</h3>
            <p>{apiMessage}</p>
          </>
        </PageAlert>
      );
    }
  };

  return (
    <AdminLayout>
      <>
        {console.log("rendering")}
        <SEO title="Home" />

        <div className="container-fluid au-body">
          <h1>Welcome back</h1>
          <h2>Which property do you want to work with today</h2>
          {renderProperties()}
        </div>
      </>
    </AdminLayout>
  );
};
