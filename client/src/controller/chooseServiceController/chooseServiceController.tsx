import { useQuery } from "@apollo/client";
import React from "react";
import {
  GetPropertiesAndUser,
  GetPropertiesAndUser_getUserProperties_Error,
  GetPropertiesAndUser_getUserProperties_NoProperties,
  GetPropertiesAndUser_getUserProperties_PropertyList,
} from "../../graphql/GetPropertiesAndUser";
import { NotFoundBasic } from "../../views/404-logged-in/404-basic";
import { ChooseServicePage } from "../../views/chooseService/chooseService";
import { GET_PROPERTIES_USER_SCHEMA } from "./service_schema";

interface Props {}

export const ChooseServiceController: (arg0: Props) => any = () => {
  const { data, loading } = useQuery<GetPropertiesAndUser>(
    GET_PROPERTIES_USER_SCHEMA
  );

  let apiMessage;

  if (loading) {
    return null;
  }

  if (data && data.getUserProperties && data.getUser) {
    const { __typename } = data.getUserProperties;
    const apiPropertyResult = data.getUserProperties;
    const apiUserResult = data.getUser;

    switch (__typename) {
      case "Error":
        const {
          message,
        } = apiPropertyResult as GetPropertiesAndUser_getUserProperties_Error;
        apiMessage = message;
        return (
          <NotFoundBasic title="Agency not added">
            <p>{apiMessage}</p>
            <p>
              Contact observatory@dta.gov.au to see how you can connect your
              agency to ObservatoryApp.
            </p>
          </NotFoundBasic>
        );

      case "NoProperties":
        const a = apiPropertyResult as GetPropertiesAndUser_getUserProperties_NoProperties;
        apiMessage = a.message;
        return (
          <NotFoundBasic title="No properties added">
            <p>{apiMessage}</p>
            <p>
              Contact observatory@dta.gov.au to see how you can connect your
              properties.
            </p>
          </NotFoundBasic>
        );

      case "PropertyList":
        const result = apiPropertyResult as GetPropertiesAndUser_getUserProperties_PropertyList;
        const properties = result.properties;
        const { name } = apiUserResult;
        return <ChooseServicePage properties={properties} name={name} />;
    }
  }
};
