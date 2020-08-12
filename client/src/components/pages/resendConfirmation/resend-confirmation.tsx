import React, { useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import { Formik, Form } from "formik";

import SubscribeField from "../../form/SearchField";
import { Aubtn } from "../../../types/auds";
import SEO from "../seo";
import { useMutation, gql } from "@apollo/client";
import {
  RESEND_CONFIRMATION_SCHEMA,
  InitialValues,
  validationSchema,
} from "./resendConfirmationSchema";
import {
  ResendConfirmation,
  ResendConfirmationVariables,
  ResendConfirmation_resendConfirmationEmail_ConfirmationEmailSent,
  ResendConfirmation_resendConfirmationEmail_EmailNotSentError,
  ResendConfirmation_resendConfirmationEmail_FieldErrors,
} from "../../../graphql/ResendConfirmation";
import PageAlert from "../../blocks/page-alert";
import { formatApiError } from "../../util/formatError";

interface Props extends RouteComponentProps {}

export const ResendConfirmationEmail: React.FC<Props> = ({ history }) => {
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
    setSaving(true);
    const { email } = formData;
    const result = await resendEmail({ variables: { email } });
    setSaving(false);
    console.log(result.data);

    if (result.data) {
      const serverResult = result.data.resendConfirmationEmail;
      const { __typename } = serverResult;

      switch (__typename) {
        case "FieldErrors":
          const errorList: Array<ApiError> = [];
          const {
            errors,
          } = serverResult as ResendConfirmation_resendConfirmationEmail_FieldErrors;
          errors?.map((error) =>
            errorList.push({ path: error.path, message: error.message })
          );
          setState({
            ...state,
            apiError: true,
            apiErrorList: errorList,
          });
          break;

        case "EmailNotSentError":
          const {
            message,
            path,
          } = serverResult as ResendConfirmation_resendConfirmationEmail_EmailNotSentError;
          setState({
            ...state,
            apiError: true,
            apiErrorList: [{ path, message }],
          });
          break;

        case "ConfirmationEmailSent":
          history.push("/confirmation", { email, name: "there" });
          break;
      }
    }
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
              <Form
                id="resend-confirmation"
                noValidate
                onSubmit={(e) => {
                  handleSubmit(e);
                  if (Object.keys(errors).length < 1) return;

                  setState({
                    ...state,
                    isErrors: true,
                    apiError: false,
                    apiErrorList: [],
                  });
                  document.title = "Errors | Sign up form";
                  const timeout = setTimeout(() => {
                    const errorSum = document.getElementById(
                      "error-heading"
                    ) as any;
                    if (errorSum && errorSum.focus()) {
                      errorSum.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                    clearTimeout(timeout);
                  }, 500);
                }}
              >
                {state.apiError && state.apiErrorList.length > 0 && (
                  <PageAlert type="error" className="max-42">
                    <>
                      <h3 id="api-error-heading">There was an error</h3>
                      <ul>{formatApiError(state.apiErrorList)}</ul>
                    </>
                  </PageAlert>
                )}
                {state.isErrors && Object.keys(errors).length > 0 ? (
                  <PageAlert type="error" className="max-42">
                    <>
                      <h3 tabIndex={0} id="error-heading">
                        There has been an error
                      </h3>
                      <ul>
                        {
                          <li>
                            <a href={`#email`}>{errors["email"]}</a>
                          </li>
                        }
                      </ul>
                    </>
                  </PageAlert>
                ) : (
                  ""
                )}
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
                      {isSaving ? "Submitting" : "Resend"}
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
