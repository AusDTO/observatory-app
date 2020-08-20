import React, { useState } from "react";
import { Formik, Form } from "formik";
import DefaultLayout from "../../layouts/DefaultLayout";
import TextField from "../../form/TextField";
import { AuFormGroup, Aubtn } from "../../../types/auds";
import SEO from "../seo";
import { useMutation } from "@apollo/client";
import {
  LOGIN_MUTATION,
  InitialValues,
  validationSchema,
} from "./login_schema";
import {
  LoginUser_login_FieldErrors,
  LoginUser_login_Error,
} from "../../../graphql/LoginUser";
import { RouteComponentProps, Link } from "react-router-dom";
import PageAlert from "../../blocks/page-alert";
import { formatApiError } from "../../util/formatError";
import {
  FormSubmitState,
  loginData,
  ApiError,
  LoginErrorName,
} from "../../../types/types";

interface Props extends RouteComponentProps {}
export const Login: React.FC<Props> = ({ history }) => {
  const [state, setState] = useState<FormSubmitState>({
    isErrors: false,
    submitted: false,
    apiError: false,
    apiErrorList: [],
  });

  const [saving, setSaving] = useState<boolean>(false);

  const [login, { data, client }] = useMutation(LOGIN_MUTATION);

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
          If you do not have an account, you can{" "}
          <Link to="/register">create one now.</Link>
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
              <TextField
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
        <AuFormGroup>
          <Link to="/forgot-password">Forgot your password?</Link>
        </AuFormGroup>
      </div>
    </DefaultLayout>
  );
};
