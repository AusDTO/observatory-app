import React from "react";
interface Props {}
export const EngagementGlossary: React.FC<Props> = () => {
  return (
    <div className="au-body mt-2">
      <section>
        <h2>Glossary</h2>
        <dl>
          <dt id="organic-def">Organic</dt>
          <dd>
            Traffic that finds this page from any of the default search engines
            such as Google, Bing or Yahoo{" "}
          </dd>
          <dt id="referral-def">Referral</dt>
          <dd>
            Traffic that finds this page from outside any of the default search
            engines, for example another website.
          </dd>
        </dl>
      </section>
    </div>
  );
};
