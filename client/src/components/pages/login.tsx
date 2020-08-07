import React, { useState } from "react";
import { Formik, Form } from "formik";
import DefaultLayout from "../layouts/DefaultLayout";
import TextField from "../form/TextField";
import * as yup from "yup";
import { AuFormGroup, Aubtn } from "../../types/auds";

export const Login: React.FC = () => {
  const InitialValues = {
    email: "",
    password: "",
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Enter a valid email")
      .required("Enter an email")
      .max(255)
      .matches(/.gov.au$/, "Only government emails are allowed to apply"),
    password: yup.string().required("Enter a password").max(255),
  });
  return (
    <DefaultLayout>
      <div className="container-fluid">
        <Formik
          initialValues={InitialValues}
          validationSchema={validationSchema}
          onSubmit={(data, errors) => {
            console.log(data);
          }}
        >
          {({ values, errors, touched, handleSubmit }) => (
            <Form>
              <TextField id="email" label="Email" width="lg" required />
              <TextField
                id="password"
                type="password"
                label="Password"
                width="lg"
                required
              />

              <AuFormGroup>
                <Aubtn>Sign in</Aubtn>
              </AuFormGroup>

              <pre>{JSON.stringify(values, null, 2)}</pre>
              <pre>{JSON.stringify(errors, null, 2)}</pre>
            </Form>
          )}
        </Formik>
      </div>
    </DefaultLayout>
  );
};
