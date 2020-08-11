import React, { useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import { Formik, Form } from "formik";
import * as yup from "yup";

import SubscribeField from "../../form/SearchField";
import { Aubtn } from "../../../types/auds";
import SEO from "../seo";

interface Props extends RouteComponentProps {}

export const ResendConfirmation: React.FC<Props> = () => {
  const [state, setState] = useState<RegisterState>({
    isErrors: false,
    submitted: false,
    apiError: false,
    apiErrorList: [],
  });

  const InitialValues = {
    email: "",
  };

  const [isSaving, setSaving] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Enter an email")
      .max(255)
      .matches(/.gov.au$/, "Only government emails are allowed to apply"),
  });

  return (
    <DefaultLayout>
      <>
        <SEO title="Resend confirmation" />

        <div className="container-fluid au-body">
          <p>
            It seems the link is broken or expired. Enter your email below and
            we will send you a new confirmation link
          </p>
          <Formik
            initialValues={InitialValues}
            validationSchema={validationSchema}
            onSubmit={(data, errors) => {
              console.log(data);
            }}
          >
            {({ values, errors, touched, handleSubmit }) => (
              <Form id="resend-confirmation">
                <div className="au-search au-search--dark au-form-group max-30">
                  <SubscribeField
                    id="email"
                    type="search"
                    label="Enter email"
                    dark={false}
                  />
                  <div className="au-search__btn">
                    <Aubtn
                      type="submit"
                      disabled={isSaving}
                      className="au-btn--medium"
                    >
                      {isSaving ? "Submitting" : "Subscribe"}
                    </Aubtn>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </>
    </DefaultLayout>
  );
};
