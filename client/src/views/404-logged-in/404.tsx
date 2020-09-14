import React from "react";
import PageAlert from "../../components/blocks/page-alert";

import SEO from "../seo";
import { AuLinkList } from "../../types/auds";
import AdminLayout from "../../components/layouts/AdminLayout";

interface Props {
  title: string;
}

export const NotFound: React.FC<Props> = ({ children, title }) => {
  return (
    <AdminLayout>
      <>
        <SEO title="Error" />

        <div className="container-fluid au-body">
          <h2>{title}</h2>
          <PageAlert type={"warning"}>
            <>{children}</>
          </PageAlert>

          <h2>Did you want to?</h2>
          <AuLinkList
            items={[
              {
                link: "/",
                text: "Services landing page",
              },
              {
                link: "/",
                text: "Make a query",
              },
            ]}
          ></AuLinkList>
        </div>
      </>
    </AdminLayout>
  );
};
