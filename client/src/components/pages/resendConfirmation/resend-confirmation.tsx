import React, { useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import { Formik, Form } from "formik";

import SubscribeField from "../../form/SearchField";
import { Aubtn } from "../../../types/auds";
import SEO from "../seo";
import { useMutation } from "@apollo/client";
import {
  RESEND_CONFIRMATION_SCHEMA,
  InitialValues,
  validationSchema,
} from "./resendConfirmationSchema";
import {
  ResendConfirmation,
  ResendConfirmationVariables,
} from "../../../graphql/ResendConfirmation";

interface Props extends RouteComponentProps {}

export const ResendConfirmationEmail: React.FC<Props> = () => {
  const [state, setState] = useState<RegisterState>({
    isErrors: false,
    submitted: false,
    apiError: false,
    apiErrorList: [],
  });

  const [isSaving, setSaving] = useState<boolean>(false);

  const [
    resendEmail,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<ResendConfirmation, ResendConfirmationVariables>(
    RESEND_CONFIRMATION_SCHEMA
  );

  const handleResendEmail = async (formData: ResendEmailData) => {
    const { email } = formData;
    const result = await resendEmail({ variables: { email } });
    console.log(result);
  };

  return (
    <DefaultLayout>
      <>
        <SEO title="Resend confirmation" />

        <div className="container-fluid au-body">
          <h2>Resend confirmation</h2>
          <p>
            Enter your email below and we will send you a new confirmation link
          </p>
          <Formik
            initialValues={InitialValues}
            validationSchema={validationSchema}
            onSubmit={(data, errors) => {
              handleResendEmail(data);
            }}
          >
            {({ values, errors, touched, handleSubmit }) => (
              <Form id="resend-confirmation" noValidate>
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
