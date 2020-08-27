import * as React from "react";
import { RouteProps, Route, Redirect, RouteComponentProps } from "react-router";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { GetUser } from "../../graphql/GetUser";

type Props = RouteProps;

export const ProtectedRoute: React.FC<Props> = ({ component, path }) => {
  const GET_USER_QUERY = gql`
    query GetUser {
      getUser {
        email
      }
    }
  `;

  const { data, loading, error } = useQuery<GetUser>(GET_USER_QUERY);

  //routeprops gives us history, match etc
  const renderRoute = (routeProps: RouteComponentProps<{}>) => {
    if (!data || loading) {
      // loading screen
      return null;
    }
    if (!data.getUser) {
      // user not logged in
      return <Redirect to="/home" />;
    }

    const Component = component as any;
    return <Component {...routeProps} />;
  };

  return <Route render={renderRoute} path={path} />;
};
