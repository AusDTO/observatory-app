import React, { useState } from "react";
import { AuPageAlert, Aubtn, AuFormGroup } from "../../../types/auds";
import { Formik, Form } from "formik";
import SubscribeField from "../../form/SearchField";
import * as Yup from "yup";
import TextField from "../../form/TextField";
import {
  InitialValues,
  sendFeedbackSchema,
  SEND_FEEDBACK_MUTATION,
} from "./feedback_schema";
import { gql, useMutation } from "@apollo/client";
import { FeedbackData, FormSubmitState } from "../../../types/types";
import {
  sendFeedback,
  sendFeedbackVariables,
} from "../../../graphql/sendFeedback";

interface Props {
  textBoxClass?: string;
  label: string;
  pageUrl: string;
  pageTitle: string;
  img: string;
}

const AskQuestionBlock: React.FC<Props> = ({
  textBoxClass,
  label,
  pageUrl,
  pageTitle,
  img,
}) => {
  const [sendFeedbackData, { loading, error, data }] = useMutation<
    sendFeedback,
    sendFeedbackVariables
  >(SEND_FEEDBACK_MUTATION);

  const [isSaving, setSaving] = useState<boolean>(false);
  const [state, setState] = useState<FormSubmitState>({
    isErrors: false,
    submitted: false,
    apiError: false,
    apiErrorList: [],
  });

  const handleSendFeedback = async (formData: FeedbackData) => {
    setSaving(true);

    const { feedback } = formData;
    const a = { feedback, pageTitle, pageUrl };
    console.log(a);

    const result = await sendFeedbackData({
      variables: { feedback, pageTitle, pageUrl },
    });
    console.log(result);
    setSaving(false);

    // if (loading) {
    //   return null;
    // }

    if (result.data && result.data.sendFeedback) {
      const serverResult = result.data.sendFeedback;

      const { __typename } = serverResult;

      switch (__typename) {
        case "Success":
          setState({ ...state, submitted: true });
          break;
      }
    }
  };

  return (
    <>
      {state.submitted ? (
        <AuPageAlert as="success" className="max-42">
          <>
            <h3>Feedback sent successfully</h3>
            <p>Feedback has been received</p>
          </>
        </AuPageAlert>
      ) : (
        <>
          <div className="col-md-8 col-sm-12">
            <Formik
              initialValues={InitialValues}
              onSubmit={async (data) => {
                await handleSendFeedback(data);
              }}
              validationSchema={sendFeedbackSchema}
              validateOnBlur={true}
              validateOnChange={false}
            >
              {({ values, errors, touched, handleSubmit, submitForm }) => (
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
                    <Aubtn
                      type="submit"
                      disabled={isSaving}
                      onClick={submitForm}
                      className="au-btn--medium"
                    >
                      {isSaving ? "Submitting" : "Submit"}
                    </Aubtn>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="col-md-3 col-sm-none">
            <img src={img} alt="" className="question-image" />
          </div>
        </>
      )}
    </>
  );
};

export default AskQuestionBlock;
