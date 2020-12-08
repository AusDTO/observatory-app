import { useMutation } from "@apollo/client";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import PageAlert from "../../components/blocks/page-alert";
import PasswordField from "../../components/form/PasswordField";
import TextField from "../../components/form/TextField";
import DefaultLayout from "../../components/layouts/DefaultLayout";
import { formatApiError } from "../../components/util/formatError";
import {
  LoginUser_login_Error,
  LoginUser_login_FieldErrors,
} from "../../graphql/LoginUser";
import { Aubtn, AuFormGroup } from "../../types/auds";
import {
  ApiError,
  FormSubmitState,
  loginData,
  LoginErrorName,
} from "../../types/types";
import { ErrorPage } from "../error/error";
import SEO from "../seo";
import {
  InitialValues,
  LOGIN_MUTATION,
  validationSchema,
} from "./login_schema";

interface Props extends RouteComponentProps {}
export const Login: React.FC<Props> = ({ history }) => {
  const [state, setState] = useState<FormSubmitState>({
    isErrors: false,
    submitted: false,
    apiError: false,
    apiErrorList: [],
  });

  const [saving, setSaving] = useState<boolean>(false);

  const [login, { client, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (data: loginData) => {
    setSaving(true);

    const { email, password } = data;

    // API call
    const result = await login({
      variables: {
        email,
        password,
      },
    });

    setSaving(false);
    if (error) {
      return (
        <ErrorPage title="Error: 500">
          <p>There was a error processing your request. Please try again</p>
        </ErrorPage>
      );
    }

    if (result.data && result.data.login) {
      const apiResult = result.data.login;
      const { __typename } = apiResult;
      await client.resetStore();

      switch (__typename) {
        case "FieldErrors":
          const errorList: Array<ApiError> = [];
          const { errors } = apiResult as LoginUser_login_FieldErrors;
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
          const { message, path } = apiResult as LoginUser_login_Error;
          setState({
            ...state,
            apiError: true,
            apiErrorList: [{ message, path }],
          });
          break;

        case "Success":
          await client.resetStore();
          history.push("/");
          break;
      }
    }
  };

  return (
    <DefaultLayout>
      <div className="container-fluid au-body">
        <SEO title="Sign in" />
        <h2>Login to ObservatoryApp</h2>

        <p>
          {" "}
          Forgot your password? Visit the{" "}
          <Link to="/forgot-password">reset password</Link> page.
        </p>
        <Formik
          initialValues={InitialValues}
          validationSchema={validationSchema}
          onSubmit={(data, errors) => {
            handleLogin(data);
          }}
        >
          {({ values, errors, touched, handleSubmit, submitForm }) => (
            <Form
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
                      {Object.keys(errors).map((error, i: number) => {
                        const errorCast = error as LoginErrorName;
                        return (
                          <li key={i}>
                            <a href={`#${error}`}>{errors[errorCast]}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                </PageAlert>
              ) : (
                ""
              )}
              <TextField id="email" label="Email" width="lg" required />
              <PasswordField
                id="password"
                type="password"
                label="Password"
                width="lg"
                required
              />

              <AuFormGroup>
                <Aubtn disabled={saving} type="submit" onClick={submitForm}>
                  {saving ? "Signing in" : "Sign in"}
                </Aubtn>
              </AuFormGroup>
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};
