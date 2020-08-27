import React, { useState, useEffect, useLayoutEffect } from "react";
import { RouteComponentProps, Router, Redirect, Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import SEO from "../seo";
import { gql, useQuery } from "@apollo/client";
import { GET_PROPERTIES_SCHEMA } from "./service_schema";
import {
  GetProperties,
  GetProperties_getUserProperties_PropertyList,
  GetProperties_getUserProperties_PropertyList_properties,
  GetProperties_getUserProperties_Error,
  GetProperties_getUserProperties_NoProperties,
} from "../../../graphql/GetProperties";
import PageAlert from "../../blocks/page-alert";

interface Props extends RouteComponentProps {}

export const ChooseService: React.FC<Props> = () => {
  const [propertiesList, updateProperties] = useState<
    Array<GetProperties_getUserProperties_PropertyList_properties> | undefined
  >();

  const [apiError, updateApiError] = useState<String | boolean>(false);

  const { data, loading, error } = useQuery<GetProperties>(
    GET_PROPERTIES_SCHEMA
  );

  useLayoutEffect(() => {
    if (data && data.getUserProperties) {
      const { __typename } = data.getUserProperties;
      const apiResult = data.getUserProperties;

      switch (__typename) {
        case "Error":
          const {
            message,
          } = apiResult as GetProperties_getUserProperties_Error;
          updateProperties(undefined);
          updateApiError(message);
          break;
        case "NoProperties":
          const a = apiResult as GetProperties_getUserProperties_NoProperties;
          updateProperties(undefined);
          updateApiError(a.message);
          break;
        case "PropertyList":
          const {
            properties,
          } = apiResult as GetProperties_getUserProperties_PropertyList;
          updateProperties(properties);
          updateApiError("");
          break;
      }
    }
  }, [loading]);

  const renderProperties = () => {
    if (!loading && data && data.getUserProperties) {
      const properties = propertiesList as Array<
        GetProperties_getUserProperties_PropertyList_properties
      >;
      if (properties && properties.length > 0) {
        return (
          <ul className="au-link-list">
            {properties.map((property, i) => (
              <li key={i}>
                <Link to={`/service/${property.ua_id}`}>
                  {property.service_name}
                </Link>
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <PageAlert type="warning" className="max-42">
            <>
              <h3>Properties not found</h3>
              <p>{apiError}</p>
            </>
          </PageAlert>
        );
      }
    }
  };

  return (
    <AdminLayout>
      <>
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
