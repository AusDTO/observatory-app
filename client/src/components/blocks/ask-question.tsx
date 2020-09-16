import React from "react";
import { AuPageAlert, Aubtn } from "../../types/auds";
import { Formik, Form } from "formik";
import SubscribeField from "../form/SearchField";
import * as Yup from "yup";
interface Props {
  className?: string;
}

export const questionSchema = Yup.object().shape({
  question: Yup.string().required("Please enter a question"),
});
const AskQuestionBlock: React.FC<Props> = ({ className }) => {
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
          <Form id="newsletter-form" className="max-42">
            <div className="au-search au-search--dark au-form-group max-42">
              <SubscribeField
                id="question"
                type="search"
                label="Share with us what you want to know, and we might answer it in the next release"
              />
              <div className="au-search__btn">
                <Aubtn type="submit" className="au-btn--medium">
                  Submit
                </Aubtn>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AskQuestionBlock;
