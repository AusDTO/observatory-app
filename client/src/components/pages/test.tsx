import { useQuery, gql } from "@apollo/client";
import React from "react";
import { GetUser, GetUserVariables } from "../../graphql/GetUser";

const EXCHANGE_RATES = gql`
  query GetUser($id: String!, $email: String!) {
    getuser(id: $id, email: $email) {
      email
      id
    }
  }
`;
const email = "hello@hellosdfsf.csom";
const id = "21241233asd";

export const ExchangeRates = () => {
  const { loading, error, data } = useQuery<GetUser, GetUserVariables>(
    EXCHANGE_RATES,
    {
      variables: { email, id },
    }
  );

  if (loading || !data) return <p>Loading...</p>;
  if (error || !data.getuser) return <p>Error :</p>;

  return <p>{data.getuser.email}</p>;
};
