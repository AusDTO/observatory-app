import React from "react";
import { AuPageAlert, Aubtn, AuFormGroup } from "../../../types/auds";
import { Formik, Form } from "formik";
import SubscribeField from "../../form/SearchField";
import * as Yup from "yup";
import TextField from "../../form/TextField";
import { questionSchema, SEND_FEEDBACK_MUTATION } from "./feedback_schema";
import { gql, useMutation } from "@apollo/client";

interface Props {
  textBoxClass?: string;
  label: string;
}

const AskQuestionBlock: React.FC<Props> = ({ textBoxClass, label }) => {
  const [sendFeedback, { loading, error, data }] = useMutation(
    SEND_FEEDBACK_MUTATION
  );

  const handleSendFeedback = async () => {};

  return (
    <>
      <Formik
        initialValues={questionSchema}
        onSubmit={(data) => {
          console.log(data);
        }}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {() => (
          <Form className="max-42">
            <TextField
              id="feedback"
              type="search"
              as="textarea"
              label={label}
              block
              className="mh-200"
            />

            <div className="mt-half">
              <Aubtn>Submit</Aubtn>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AskQuestionBlock;
