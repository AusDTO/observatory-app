import { ResolverMap } from "../../types/graphql-util";
import { IGetPeakDataType } from "../../types/schema";
import {
  basicApiErrorMessage,
  bigQuery,
  REDIS_PEAK_TS_PREFIX,
} from "../../util/constants";
import { createMiddleware } from "../../util/createMiddleware";
import { validatePeakDataRequest } from "./validatePeakDataReq";

require("dotenv").config();

export const resolvers: ResolverMap = {
  Query: {
    getPeakTimeSeriesData: createMiddleware(
      validatePeakDataRequest,
      async (_, args: IGetPeakDataType, { redis_client, session }) => {
        const { property_ua_id } = args;
        const uaid = property_ua_id.toLowerCase().replace(/-/g, "_");

        const dataExists = await redis_client.get(
          `${REDIS_PEAK_TS_PREFIX}${uaid}`
        );

        if (dataExists) {
          console.log("Fetching data from cache");
          return {
            __typename: "PeakTimeSeriesData",
            output: JSON.parse(dataExists),
          };
        }

        const query = `SELECT pageviews,sessions,visit_hour
        FROM \`dta_customers.${uaid}_peakseries_24hrs_weekly\``;
        try {
          const [job] = await bigQuery.createQueryJob({
            query,
          });
          console.log(`Job ${job.id} started.`);

          const [rows] = await job.getQueryResults();

          if (rows.length > 0) {
            await redis_client.set(
              `${REDIS_PEAK_TS_PREFIX}${uaid}`,
              JSON.stringify(rows),
              "ex",
              60 * 60 * 12
            );

            return {
              __typename: "PeakTimeSeriesData",
              output: rows,
            };
          } else {
            return basicApiErrorMessage(
              "There was an unexpected error fetching your data",
              "table"
            );
          }
        } catch (err) {
          console.error(err.errors);
          return basicApiErrorMessage(
            "There was an unexpected error fetching your data",
            "table"
          );
        }
      }
    ),

    getPeakDemandData: createMiddleware(
      validatePeakDataRequest,
      async (_, args: IGetPeakDataType, { session, redis_client }) => {
        //use session data
        const { property_ua_id } = args;

        const uaid = property_ua_id.toLowerCase().replace(/-/g, "_");

        const dataCache = await redis_client.get(
          `$"{REDIS_PEAK_TS_PREFIX}"${property_ua_id}`
        );

        if (dataCache) {
          console.log("fetching from cache");

          const data = JSON.parse(dataCache);

          if (data.length < 1) {
            return basicApiErrorMessage("No data found", "data");
          }

          return {
            __typename: "PeakDataResult",
            output: data,
          };
        } else {
          const data = "YES VALID";
          await redis_client.setex(
            `PEAKDATA${property_ua_id}`,
            60 * 60 * 12,
            data
          );

          return {
            __typename: "PeakDataResult",
            message: data,
          };
        }
      }
    ),
  },
};
