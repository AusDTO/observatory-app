import { useQuery } from "@apollo/client";
import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { formatApiError } from "../../components/util/formatError";
import {
  GetProperty,
  GetPropertyVariables,
  GetProperty_getProperty_Error,
  GetProperty_getProperty_FieldErrors,
  GetProperty_getProperty_Property,
} from "../../graphql/GetProperty";
import { ApiError } from "../../types/types";
import { NotFound } from "../../views/404-logged-in/404";
import { ServiceLandingPage } from "../../views/serviceLandingPage/serviceLanding";
import { GET_PROPERTY_SCHEMA } from "./service_landing.schema";

interface Props extends RouteComponentProps<{ ua_id: string }> {} // key

export const ServiceLandingController: (arg0: Props) => any = ({ match }) => {
  const { ua_id } = match.params;

  const { data, loading } = useQuery<GetProperty, GetPropertyVariables>(
    GET_PROPERTY_SCHEMA,
    { variables: { property_ua_id: ua_id } }
  );

  if (loading) {
    return null; //FIX
  }

  let apiErrorMessage: string | undefined = undefined;
  let property: GetProperty_getProperty_Property | undefined = undefined;
  let apiErrors: ApiError[] | undefined = undefined;

  if (data && data.getProperty) {
    const apiResult = data.getProperty;
    const { __typename } = apiResult;

    switch (__typename) {
      case "Error":
        const { message } = apiResult as GetProperty_getProperty_Error;
        apiErrorMessage = message;
        return (
          <NotFound title="There was an error">
            <p>{message}</p>
          </NotFound>
        );

      case "FieldErrors":
        const { errors } = apiResult as GetProperty_getProperty_FieldErrors;
        apiErrors = errors;
        return (
          <NotFound title="There was an error">
            <p>{formatApiError(errors)}</p>
          </NotFound>
        );

      case "Property":
        property = apiResult as GetProperty_getProperty_Property;
        return <ServiceLandingPage property={property} />;
    }
  }
};
