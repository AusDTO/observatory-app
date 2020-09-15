import React from "react";
import SelectField from "../../components/form/SelectField";
import {
  Aubtn,
  AuFormGroup,
  AuLabel,
  AuSelect,
  AuTagList,
  AuTextInput,
} from "../../types/auds";

interface Props {} // key

export const MetricsView: React.FC<Props> = () => {
  return (
    <div className="mt-2">
      <h2>
        Which metrics will help you better understand the questions you are
        asking?
      </h2>
      <section className="mt-2">
        <h3>Users</h3>
        <AuTagList
          className="metric-tags"
          tags={[
            {
              link: "#",
              text: "User",
              li: {
                className: "active",
              },
            },
            {
              link: "#",
              text: "Device type",
            },
          ]}
        />
      </section>
      <section className="mt-2">
        <h3>Sessions</h3>
        <AuTagList
          className="metric-tags"
          tags={[
            {
              link: "#",
              text: "Sessions (total)",
              li: {
                className: "active",
              },
            },
            {
              link: "#",
              text: "Bounces",
              li: {
                className: "active",
              },
            },
            {
              link: "#",
              text: "Sessions duration",
            },
            {
              link: "#",
              text: "Pages per session",
            },
          ]}
        />
      </section>
      <section className="mt-2">
        <h3>Search</h3>
        <AuTagList
          className="metric-tags"
          tags={[
            {
              link: "#",
              text: "Search",
            },
            {
              link: "#",
              text: "Search words",
            },
          ]}
        />
      </section>
      <section className="mt-2">
        <h3>Traffic</h3>
        <AuTagList
          className="metric-tags"
          tags={[
            {
              link: "#",
              text: "Traffic source",
            },
            {
              link: "#",
              text: "Source/medium",
            },
          ]}
        />
      </section>
      <section className="mt-3">
        <h3>Filters</h3>
        <form className="metric-filter-form">
          <div className="row">
            <div className="col-md-8">
              <AuFormGroup className="flex-basis">
                <AuLabel text="Enter the URL you wish to inspect" />
                <AuSelect
                  id="url"
                  block
                  label="Enter the url you wish to inspect"
                  options={[
                    {
                      value: "",
                      text: "Please select",
                    },
                    {
                      value: "1",
                      text: "Option 1",
                    },
                  ]}
                ></AuSelect>
              </AuFormGroup>
            </div>
            <div className="col-md-4 ">
              <AuFormGroup>
                <AuLabel text="Date range" />
                <AuTextInput block />
              </AuFormGroup>
            </div>
          </div>
          <div className="flex flex-jc-end mt-half">
            <Aubtn className="au-btn--bright">Analyse</Aubtn>
          </div>
        </form>
      </section>
    </div>
  );
};
