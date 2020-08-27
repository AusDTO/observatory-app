import React, { useState } from "react";
import DefaultLayout from "../../components/layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import SEO from "../../views/seo";
import AdminLayout from "../../components/layouts/AdminLayout";
import { gql, useQuery } from "@apollo/client";
import {
  GetProperty,
  GetPropertyVariables,
  GetProperty_getProperty_Error,
  GetProperty_getProperty_Property,
} from "../../graphql/GetProperty";
import { GET_PROPERTY_SCHEMA } from "./service_landing.schema";
import { ServiceLandingPage } from "../../views/serviceLandingPage/serviceLanding";

interface Props extends RouteComponentProps<{ propertyId: string }> {} // key

export const ServiceLandingController: React.FC<Props> = ({
  history,
  match,
}) => {
  const { propertyId } = match.params;

  const { data, loading, error } = useQuery<GetProperty, GetPropertyVariables>(
    GET_PROPERTY_SCHEMA,
    { variables: { propertyId } }
  );

  if (loading) {
    return <ServiceLandingPage />;
  }

  if (data && data.getProperty) {
    const apiResult = data.getProperty;
    const { __typename } = apiResult;

    switch (__typename) {
      case "Error":
        const { message } = apiResult as GetProperty_getProperty_Error;
        return <ServiceLandingPage apiErrorMessage={message} />;

      case "FieldErrors":
        break;
      case "Property":
        const property = apiResult as GetProperty_getProperty_Property;
        return <ServiceLandingPage property={property} />;
    }
  }

  return <ServiceLandingPage />;
};
