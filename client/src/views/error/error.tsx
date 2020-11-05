import React from "react";
import PageAlert from "../../components/blocks/page-alert";

import SEO from "../seo";
import DefaultLayout from "../../components/layouts/DefaultLayout";

interface Props {
  title: string;
}

export const ErrorPage: React.FC<Props> = ({ children, title }) => {
  return (
    <DefaultLayout>
      <>
        <SEO title="Error" />

        <div className="container-fluid au-body">
          <h2>{title}</h2>
          <PageAlert type={"error"} className="max-42">
            <>{children}</>
          </PageAlert>
        </div>
      </>
    </DefaultLayout>
  );
};
