import { useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import PageAlert from "../../components/blocks/page-alert";
import TextField from "../../components/form/TextField";
import DefaultLayout from "../../components/layouts/DefaultLayout";
import { formatApiError } from "../../components/util/formatError";
import {
  SendPasswordResetEmail,
  SendPasswordResetEmailVariables,
  SendPasswordResetEmail_sendForgotPasswordEmail_FieldErrors,
} from "../../graphql/SendPasswordResetEmail";
import { Aubtn, AuFormGroup } from "../../types/auds";
import {
  ApiError,
  FormSubmitState,
  ResetPasswordEmailData,
} from "../../types/types";
import SEO from "../seo";
import {
  FORGOT_PASSWORD_SCHEMA,
  InitialValues,
  validationSchema,
} from "./forgotPassowrd_schema";

interface Props extends RouteComponentProps {}

export const PasswordResetEmailPage: React.FC<Props> = ({ history }) => {
  const [state, setState] = useState<FormSubmitState>({
    isErrors: false,
    submitted: false,
    apiError: false,
    apiErrorList: [],
  });

  const [isSaving, setSaving] = useState<boolean>(false);

  const [sendForgotPasswordEmail] = useMutation<
    SendPasswordResetEmail,
    SendPasswordResetEmailVariables
  >(FORGOT_PASSWORD_SCHEMA);

  const handleResetPassword = async (formData: ResetPasswordEmailData) => {
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
                  type="email"
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
