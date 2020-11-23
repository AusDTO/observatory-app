import { ResolverMap } from "../../types/graphql-util";
import { Property } from "../../entity/Property";
import { IGetDataFromUrlType, IGetPropertyType } from "../../types/schema";
import * as yup from "yup";
import { formatYupError } from "../../util/formatYupError";
import { basicApiErrorMessage } from "../../util/constants";
import { ua_id_schema } from "../../util/yup";
import { BigQuery } from "@google-cloud/bigquery";
require("dotenv").config();

const bigQuery = new BigQuery({
  credentials: {
    client_email: process.env.BIGQUERY_EMAIL,
    private_key: (process.env.BIGQUERY_PRIVATE_KEY as string).replace(
      /\\n/gm,
      "\n"
    ),
  },
  projectId: "dta-ga-bigquery",
});

const validationSchema = yup.object().shape({
  property_ua_id: ua_id_schema,
  url: yup.string(),
});

export const resolvers: ResolverMap = {
  Query: {
    getDataFromUrl: async (_, args: IGetDataFromUrlType, { session }) => {
      //use session data

      try {
        await validationSchema.validate(args, {
          abortEarly: false,
        });
      } catch (errors) {
        return {
          __typename: "FieldErrors",
          errors: formatYupError(errors),
        };
      }

      const { url, property_ua_id } = args;

      const query = `SELECT hostname,
      pagePath,
      pageviews_weekly
    FROM \`dta_customers.sample_kp2_dta\`
    WHERE pagePath='${url}'
    LIMIT 100`;

      const [job] = await bigQuery.createQueryJob({ query });
      console.log(`Job ${job.id} started.`);

      // Wait for the query to finish
      const [rows] = await job.getQueryResults();

      if (rows.length < 1) {
        return basicApiErrorMessage("No data found", "data");
      }
      console.log(rows);

      return {
        __typename: "Message",
        message: "Hello",
      };
    },
  },
};
