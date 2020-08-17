import React, { useState } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { RouteComponentProps } from "react-router-dom";
import { Formik, Form } from "formik";

import SubscribeField from "../../form/SearchField";
import { Aubtn, AuFormGroup } from "../../../types/auds";
import SEO from "../seo";
import { useMutation, gql } from "@apollo/client";

import PageAlert from "../../blocks/page-alert";
import { formatApiError } from "../../util/formatError";
import {
  FormSubmitState,
  ResendEmailData,
  ApiError,
  RestPasswordData,
} from "../../../types/types";
import {
  InitialValues,
  validationSchema,
  FORGOT_PASSWORD_SCHEMA,
} from "./forgotPassowrd_schema";
import TextField from "../../form/TextField";
import {
  SendPasswordResetEmail,
  SendPasswordResetEmailVariables,
  SendPasswordResetEmail_sendForgotPasswordEmail_FieldErrors,
  SendPasswordResetEmail_sendForgotPasswordEmail_Error,
} from "../../../graphql/SendPasswordResetEmail";

interface Props extends RouteComponentProps {}

export const ResetPasswordPage: React.FC<Props> = ({ history }) => {
  const [state, setState] = useState<FormSubmitState>({
    isErrors: false,
    submitted: false,
    apiError: false,
    apiErrorList: [],
  });

  const [isSaving, setSaving] = useState<boolean>(false);
  const FORGOT_PASSWORD_SCHEMA = gql`
    mutation SendPasswordResetEmail($email: String) {
      sendForgotPasswordEmail(email: $email) {
        __typename
        ... on FieldErrors {
          errors {
            path
            message
          }
        }

        ... on Error {
          path
          message
        }

        ... on Success {
          message
        }
      }
    }
  `;

  const [
    sendForgotPasswordEmail,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<SendPasswordResetEmail, SendPasswordResetEmailVariables>(
    FORGOT_PASSWORD_SCHEMA
  );

  const handleResetPassword = async (formData: RestPasswordData) => {
    setSaving(true);
    const { email } = formData;
    const result = await sendForgotPasswordEmail({ variables: { email } });
    setSaving(false);

    if (result.data) {
      const serverResult = result.data.sendForgotPasswordEmail;
      const { __typename } = serverResult;

      switch (__typename) {
        case "FieldErrors":
          const errorList: Array<ApiError> = [];
          const {
            errors,
          } = serverResult as SendPasswordResetEmail_sendForgotPasswordEmail_FieldErrors;
          errors?.map((error) =>
            errorList.push({ path: error.path, message: error.message })
          );
          setState({
            ...state,
            apiError: true,
            apiErrorList: errorList,
          });
          break;

        case "Error":
          const {
            message,
          } = serverResult as SendPasswordResetEmail_sendForgotPasswordEmail_Error;
          history.push("/password-reset-email", { email });
          break;

        case "Success":
          history.push("/password-reset-email", { email });
          break;
      }
    }
  };

  return (
    <DefaultLayout>
      <>
        <SEO title="Reset password" />

        <div className="container-fluid au-body">
          <h2>Reset password</h2>
          <p>
            Enter your gov.au email below and we will send you a link to reset
            your password.
          </p>
          <Formik
            initialValues={InitialValues}
            validationSchema={validationSchema}
            onSubmit={(data, errors) => {
              handleResetPassword(data);
            }}
          >
            {({ values, errors, touched, handleSubmit, submitForm }) => (
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

                <TextField
                  id="email"
                  type="search"
                  width="xl"
                  label="Enter email"
                  dark={false}
                />
                <AuFormGroup>
                  <Aubtn
                    type="submit"
                    disabled={isSaving}
                    onClick={submitForm}
                    className="au-btn--medium"
                  >
                    {isSaving ? "Submitting" : "Reset"}
                  </Aubtn>
                </AuFormGroup>
              </Form>
            )}
          </Formik>
        </div>
      </>
    </DefaultLayout>
  );
};
