import React from "react";
import Helmet from "react-helmet";

interface SeoProps {
  description?: string;
  language?: string;
  title: string;
  lang?: string;
  meta?: Array<object>;
}

const SEO: React.FC<SeoProps> = ({
  description,
  lang = "en",
  meta = [],
  title,
}) => {
  const metaDescription = description || "Obervatory app";

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ObservatoryApp`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: "DTA",
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
      ]}
      bodyAttributes={{
        class: "au-grid",
      }}
    >
      <script>
        {`var $html=document.documentElement;if($html.classList)$html.classList.remove("no-js"),$html.classList.add("js");else{var className="no-js";$html.className=$html.className.replace(new RegExp("(^|\\b)"+className.split(" ").join("|")+"(\\b|$)","gi")," "),$html.className+=" js",console.log("added js")}`}
      </script>
    </Helmet>
  );
};

export default SEO;
