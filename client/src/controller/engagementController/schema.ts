import * as yup from "yup";

export const engagementFormSchema = yup.object().shape({
  url: yup
    .string()
    .url(
      "Enter a valid URL. Make sure to include the protocol. i.e. https://cloud.gov.au"
    )
    .required("Enter a url")
    .matches(/.gov.au/, "You can only search .gov.au domains"),
  timePeriod: yup.string().required().oneOf(["weekly", "daily"]),
});
