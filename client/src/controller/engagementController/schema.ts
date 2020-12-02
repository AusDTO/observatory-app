import { gql } from "@apollo/client";
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

const GET_URL_DATA = gql`
  query UrlData($property_ua_id: String!, $url: String!, $dateType: String!) {
    getDataFromUrl(
      property_ua_id: $property_ua_id
      url: $url
      dateType: $dateType
    ) {
      __typename
      ... on FieldErrors {
        errors {
          message
          path
        }
      }
      ... on InvalidProperty {
        message
      }
      ... on Message {
        message
      }
      ... on Error {
        message
      }
      ... on UrlDataResult {
        output {
          date
          desktop
          time_on_page
        }
      }
    }
  }
`;
