/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import "../../sass/main.scss";
import Header from "../navigation/header";

interface Props {
  children: React.ReactElement;
}

const DefaultLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
};

export default DefaultLayout;
