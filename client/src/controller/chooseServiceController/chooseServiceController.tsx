import React, { useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

import { ChooseServicePage } from "../../views/chooseService/chooseService";
import { GET_PROPERTIES_USER_SCHEMA } from "./service_schema";
import {
  GetPropertiesAndUser,
  GetPropertiesAndUser_getUserProperties_PropertyList_properties,
  GetPropertiesAndUser_getUserProperties_Error,
  GetPropertiesAndUser_getUserProperties_NoProperties,
  GetPropertiesAndUser_getUserProperties_PropertyList,
  GetPropertiesAndUser_getUser,
} from "../../graphql/GetPropertiesAndUser";

interface Props {}

export const ChooseServiceController: React.FC<Props> = () => {
  const { data, loading, error } = useQuery<GetPropertiesAndUser>(
    GET_PROPERTIES_USER_SCHEMA
  );

  let apiMessage;
  let properties:
    | Array<GetPropertiesAndUser_getUserProperties_PropertyList_properties>
    | undefined = undefined;
  let userInfo: GetPropertiesAndUser_getUser = {
    __typename: "User",
    name: "",
    email: "",
    id: "",
    agency: { name: "", __typename: "Agency" },
  };

  if (data && data.getUserProperties && data.getUser && !loading) {
    const { __typename } = data.getUserProperties;
    const apiPropertyResult = data.getUserProperties;
    userInfo = data.getUser;

    switch (__typename) {
      case "Error":
        const {
          message,
        } = apiPropertyResult as GetPropertiesAndUser_getUserProperties_Error;
        apiMessage = message;
        break;

      case "NoProperties":
        const a = apiPropertyResult as GetPropertiesAndUser_getUserProperties_NoProperties;
        apiMessage = a.message;
        break;

      case "PropertyList":
        const result = apiPropertyResult as GetPropertiesAndUser_getUserProperties_PropertyList;
        properties = result.properties;
    }
  }
  return (
    <ChooseServicePage
      properties={properties}
      apiMessage={apiMessage}
      userInfo={userInfo}
    />
  );
};
