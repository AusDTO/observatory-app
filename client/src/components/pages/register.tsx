import React, { useState } from "react";
import { Formik, Form } from "formik";
import DefaultLayout from "../layouts/DefaultLayout";
import * as yup from "yup";
import TextField from "../form/TextField";
import SelectField from "../form/SelectField";
import { Aubtn, AuFormGroup } from "../../types/auds";

export const Register: React.FC = () => {
  const InitialValues = {
    name: "",
    email: "",
    agency: "",
    role: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Enter an email")
      .max(255)
      .matches(/.gov.au$/, "Only government emails are allowed to apply"),
    password: yup
      .string()
      .required("Enter a password")
      .max(255)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Your password needs to be stronger"
      ),
    name: yup.string().required("Enter a name").min(2),
    agency: yup.string().required("Enter an agency").min(2),
    role: yup.string().required("Enter your role").min(2),
  });

  return (
    <DefaultLayout>
      <div className="container-fluid">
        <div className="au-body">
          <div>
            <h3>Create your observatory reports account</h3>
            <p>
              This tool is currently in its Alpha phase, meaning access is
              limited to agencies with Observatory subscriptions only
            </p>
            <p>
              To connect your Google Analytics account to the Observatory please
              contact us
            </p>
          </div>
          <Formik
            initialValues={InitialValues}
            validationSchema={validationSchema}
            onSubmit={(data, errors) => {
              console.log(data);
            }}
          >
            {({ values, errors, touched, handleSubmit }) => (
              <Form>
                <TextField id="name" label="Your name" width="lg" required />
                <TextField id="email" label="Work email" width="lg" required />
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
                  label="Estimated billable hits per month"
                  hint="Please note, this would be the total hits expected for all of your accounts listed above."
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
                  <Aubtn>Sign Up</Aubtn>
                </AuFormGroup>

                {/* <pre>{JSON.stringify(values, null, 2)}</pre>
                <pre>{JSON.stringify(errors, null, 2)}</pre> */}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </DefaultLayout>
  );
};
