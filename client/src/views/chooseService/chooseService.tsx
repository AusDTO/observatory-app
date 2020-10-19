import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/layouts/AdminLayout";
import SEO from "../seo";

import { GetPropertiesAndUser_getUserProperties_PropertyList_properties } from "../../graphql/GetPropertiesAndUser";

interface Props {
  properties: Array<
    GetPropertiesAndUser_getUserProperties_PropertyList_properties
  >;
  name: string;
}
export const ChooseServicePage: React.FC<Props> = ({ properties, name }) => {
  return (
    <AdminLayout>
      <>
        <SEO title="Home" />

        <div className="container-fluid au-body">
          <h1>Welcome back, {name}</h1>
          <h2>Which property do you want to work with today</h2>
          <ul className="au-link-list mt-1">
            {properties.map((property, i) => (
              <li key={i}>
                <Link to={`/service/${property.ua_id}`}>
                  {property.service_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    </AdminLayout>
  );
};
