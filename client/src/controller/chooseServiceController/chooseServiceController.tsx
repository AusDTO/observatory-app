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
import { ServiceLandingPage } from "../../views/serviceLandingPage/serviceLanding";
import {
  GetProperties,
  GetProperties_getUserProperties_Error,
  GetProperties_getUserProperties_NoProperties,
  GetProperties_getUserProperties_PropertyList,
} from "../../graphql/GetProperties";
import { GET_PROPERTIES_SCHEMA } from "./service_schema";
import { ChooseServicePage } from "../../views/chooseService/chooseService";

interface Props {}

export const ChooseServiceController: React.FC<Props> = () => {
  const { data, loading, error } = useQuery<GetProperties>(
    GET_PROPERTIES_SCHEMA
  );

  if (loading) {
    return <ChooseServicePage />;
  }
  let apiMessage;
  let properties: GetProperties_getUserProperties_PropertyList;

  if (data && data.getUserProperties) {
    const { __typename } = data.getUserProperties;
    const apiResult = data.getUserProperties;

    switch (__typename) {
      case "Error":
        const { message } = apiResult as GetProperties_getUserProperties_Error;
        return <ChooseServicePage apiMessage={message} />;

      case "NoProperties":
        const a = apiResult as GetProperties_getUserProperties_NoProperties;
        return <ChooseServicePage apiMessage={a.message} />;

      case "PropertyList":
        const {
          properties,
        } = apiResult as GetProperties_getUserProperties_PropertyList;
        return <ChooseServicePage properties={properties} />;
    }
  }
  return <ChooseServicePage />;
};
