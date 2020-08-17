import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./sass/main.scss";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HelmetProvider } from "react-helmet-async";

const client = new ApolloClient({
  uri: "http://localhost:4000/api", //FIX needs to be conditional
  cache: new InMemoryCache(),
  credentials: "include", // FIX CORS
});

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
