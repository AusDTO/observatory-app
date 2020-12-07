import { ResolverMap } from "../../types/graphql-util";

import { IGetDataFromUrlType } from "../../types/schema";
import { formatYupError } from "../../util/formatYupError";
import { basicApiErrorMessage } from "../../util/constants";
import { BigQuery, JobResponse } from "@google-cloud/bigquery";
require("dotenv").config();
import { createMiddleware } from "../../util/createMiddleware";
import { validateDataRequest } from "./validateDataRequest";

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

export const resolvers: ResolverMap = {
  Query: {
    getDataFromUrl: createMiddleware(
      validateDataRequest,
      async (_, args: IGetDataFromUrlType, { session, redis_client }) => {
        //use session data
        const { url, property_ua_id, dateType } = args;

        const urlTrimmed = url.replace(/(^\w+:|^)\/\//, "").toLowerCase();
        const uaid = property_ua_id.toLowerCase().replace(/-/g, "_");

        const dataCache = await redis_client.get(
          `urldata:${dateType}:${urlTrimmed}`
        );

        if (dataCache) {
          console.log("fetching from cache");

          const data = JSON.parse(dataCache);

          if (data.length < 1) {
            return basicApiErrorMessage("No data found", "data");
          }

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
              await redis_client.set(
                `urldata:${dateType}:${urlTrimmed}`,
                JSON.stringify(rows),
                "ex",
                120
              );
              return basicApiErrorMessage("No data found", "data");
            }

            await redis_client.set(
              `urldata:${dateType}:${urlTrimmed}`,
              JSON.stringify(rows),
              "ex",
              60 * 60 * 12
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
      }
    ),
  },
};
