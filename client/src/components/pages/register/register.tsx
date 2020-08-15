import React, { useState } from "react";
import { Formik, Form } from "formik";
import DefaultLayout from "../../layouts/DefaultLayout";
import TextField from "../../form/TextField";
import SelectField from "../../form/SelectField";
import { Aubtn, AuFormGroup } from "../../../types/auds";
import {
  InitialValues,
  validationSchema,
  REGISTER_SCHEMA,
} from "./register_schema";
import PageAlert from "../../blocks/page-alert";
import { useMutation, gql } from "@apollo/client";
import {
  RegisterUser,
  RegisterUserVariables,
  RegisterUser_register_UserAlreadyExistsError,
  RegisterUser_register_FieldErrors,
  RegisterUser_register_UserRegistered,
} from "../../../graphql/RegisterUser";
import { RouteComponentProps } from "react-router-dom";
import { formatApiError } from "../../util/formatError";
import SEO from "../seo";

interface Props extends RouteComponentProps {}
export const Register: React.FC<Props> = ({ history }) => {
  const [state, setState] = useState<FormSubmitState>({
    isErrors: false,
    submitted: false,
    apiError: false,
    apiErrorList: [],
  });

  const [saving, setSaving] = useState<boolean>(false);

  //call addUser when we want to mutate
  const [
    addUser,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation<RegisterUser, RegisterUserVariables>(REGISTER_SCHEMA);

  // if (mutationLoading) return <p>Loading...</p>;
  if (mutationError) return <p>Error :(</p>;

  /**
   * Handle the registering of the user server side
   */
  const handleRegisterUser = async (formData: RegisterData) => {
    setSaving(true);
    const { email, password, agency, role, name } = formData;
    const result = await addUser({
      variables: { email, password, agency, role, name },
    });
    setSaving(false);

    // handle result
    if (result.data && result.data.register) {
      const apiData = result.data.register;
      const { __typename } = apiData;

      switch (__typename) {
        case "UserRegistered":
          history.push("/confirmation", { name, email });
          break;

        case "FieldErrors":
          const errorList: Array<ApiError> = [];
          const { errors } = apiData as RegisterUser_register_FieldErrors;
          errors?.map((error) =>
            errorList.push({ path: error.path, message: error.message })
          );
          setState({
            ...state,
            apiError: true,
            apiErrorList: errorList,
          });
          break;

        case "UserAlreadyExistsError":
          const {
            message,
            path,
          } = apiData as RegisterUser_register_UserAlreadyExistsError;

          setState({
            ...state,
            apiError: true,
            apiErrorList: [{ message, path }],
          });
          break;
      }
    }
  };

  return (
    <DefaultLayout>
      <>
        <SEO title="Register" />
        <div className="container-fluid">
          <div className="au-body">
            <div>
              <h2>Create your observatory reports account</h2>
              <p>
                This tool is currently in its Alpha phase, meaning access is
                limited to agencies with Observatory subscriptions only
              </p>
              <p>
                To connect your Google Analytics account to the Observatory
                please contact us
              </p>
            </div>
            <Formik
              initialValues={InitialValues}
              validationSchema={validationSchema}
              onSubmit={(data, errors) => {
                handleRegisterUser(data);
              }}
            >
              {({ values, errors, touched, handleSubmit, submitForm }) => (
                <Form
                  noValidate
                  className="mb-2"
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
                            const errorCast = error as RegisterErrorName;
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
                  <TextField id="name" label="Your name" width="lg" required />
                  <TextField
                    id="email"
                    label="Work email"
                    width="lg"
                    required
                  />
                  <TextField
                    id="password"
                    type="password"
                    hint="Minimum 8 characters, including one uppercase, one lowercase, one number and one special case character"
                    label="Create a password"
                    width="lg"
                    required
                  />
                  <SelectField
                    id="agency"
                    label="Agency"
                    options={[
                      { value: "", text: "Choose one" },
                      { value: "DTA", text: "Digital Transformation Agency" },
                    ]}
                  />
                  <TextField
                    id="role"
                    label="What is your role?"
                    width="lg"
                    required
                  />
                  <AuFormGroup>
                    <Aubtn type="submit" onClick={submitForm} disabled={saving}>
                      {saving ? "Submitting" : "Subscribe"}
                    </Aubtn>
                  </AuFormGroup>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </>
    </DefaultLayout>
  );
};
