import { ResolverMap } from "../../types/graphql-util";
import { Property } from "../../entity/Property";
import { IGetDataFromUrlType, IGetPropertyType } from "../../types/schema";
import * as yup from "yup";
import { formatYupError } from "../../util/formatYupError";
import { basicApiErrorMessage, basicApiMessage } from "../../util/constants";
import { ua_id_schema } from "../../util/yup";
import { BigQuery, JobResponse } from "@google-cloud/bigquery";
import { User } from "../../entity/User";
import { validateDataRequest } from "../../util/middleware/validateDataRequest";
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
  url: yup.string().url(),
  dateType: yup.string().oneOf(["weekly", "daily"]),
});

export const resolvers: ResolverMap = {
  Query: {
    getDataFromUrl: async (
      _,
      args: IGetDataFromUrlType,
      { session, redis_client }
    ) => {
      //use session data
      const { url, property_ua_id, dateType } = args;

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

      const { userId, agencyId } = session;

      await validateDataRequest(userId, property_ua_id, agencyId);

      const urlTrimmed = url.replace(/(^\w+:|^)\/\//, "").toLowerCase();
      const uaid = property_ua_id.toLowerCase().replace(/-/g, "_");

      const dataCache = await redis_client.get(
        `urldata:${dateType}:${urlTrimmed}`
      );

      if (dataCache) {
        console.log("fetching from cache");

        const data = JSON.parse(dataCache);

        return {
          __typename: "UrlDataResult",
          output: data,
        };
      } else {
        const query = `SELECT *,
      FROM \`dta_customers.${uaid}_urlpage_usage_${dateType}\`
      WHERE page_url='${urlTrimmed}'
      LIMIT 100`;
        // console.log("doing here");
        console.log("executing job");
        try {
          const [job] = await bigQuery.createQueryJob({
            query,
          });
          console.log(`Job ${job.id} started.`);

          const [rows] = await job.getQueryResults();
          if (rows.length < 1) {
            return basicApiErrorMessage("No data found", "data");
          }

          await redis_client.set(
            `urldata:${dateType}:${urlTrimmed}`,
            JSON.stringify(rows),
            "ex",
            60
          );

          return {
            __typename: "UrlDataResult",
            output: rows,
          };
        } catch (err) {
          console.error(err.errors);
          return basicApiErrorMessage(err.errors[0].message, "table");
        }
      }
    },
  },
};
