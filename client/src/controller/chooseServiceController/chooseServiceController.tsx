import React from "react";
import { useQuery } from "@apollo/client";
import {
  GetProperties,
  GetProperties_getUserProperties_Error,
  GetProperties_getUserProperties_NoProperties,
  GetProperties_getUserProperties_PropertyList,
  GetProperties_getUserProperties_PropertyList_properties,
} from "../../graphql/GetProperties";
import { GET_PROPERTIES_SCHEMA } from "./service_schema";
import { ChooseServicePage } from "../../views/chooseService/chooseService";

interface Props {}

export const ChooseServiceController: React.FC<Props> = () => {
  const { data, loading, error } = useQuery<GetProperties>(
    GET_PROPERTIES_SCHEMA
  );

  let apiMessage;
  let properties:
    | Array<GetProperties_getUserProperties_PropertyList_properties>
    | undefined = undefined;

  if (data && data.getUserProperties && !loading) {
    const { __typename } = data.getUserProperties;
    const apiResult = data.getUserProperties;

    switch (__typename) {
      case "Error":
        const { message } = apiResult as GetProperties_getUserProperties_Error;
        apiMessage = message;
        break;

      case "NoProperties":
        const a = apiResult as GetProperties_getUserProperties_NoProperties;
        apiMessage = a.message;
        break;

      case "PropertyList":
        const result = apiResult as GetProperties_getUserProperties_PropertyList;
        properties = result.properties;
    }
  }
  return <ChooseServicePage properties={properties} apiMessage={apiMessage} />;
};
