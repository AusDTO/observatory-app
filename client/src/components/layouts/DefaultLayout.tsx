/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import "../../sass/main.scss";
import Footer from "../navigation/footer";
import Header from "../navigation/header";

interface Props {
  children: React.ReactElement;
}

const DefaultLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
