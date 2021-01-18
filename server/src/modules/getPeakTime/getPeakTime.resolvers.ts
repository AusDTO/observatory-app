import { ResolverMap } from "../../types/graphql-util";
import { IGetPeakDataType } from "../../types/schema";
import {
  basicApiErrorMessage,
  bigQuery,
  REDIS_PEAK_DATA_PREFIX,
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
          `${REDIS_PEAK_TS_PREFIX}${property_ua_id}`
        );

        if (dataExists) {
          console.log("Fetching data from cache");
          return {
            __typename: "PeakTimeSeriesData",
            output: JSON.parse(dataExists),
          };
        }

        const query = `SELECT visit_hour,pageviews,sessions
        FROM \`dta_customers.${uaid}_peakseries_24hrs_weekly\``;
        try {
          const [job] = await bigQuery.createQueryJob({
            query,
          });
          console.log(`Job ${job.id} started.`);

          const [rows] = await job.getQueryResults();

          if (rows.length > 0) {
            console.log(rows.length);

            await redis_client.set(
              `${REDIS_PEAK_TS_PREFIX}${property_ua_id}`,
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
          `${REDIS_PEAK_DATA_PREFIX}${property_ua_id}`
        );

        if (dataCache) {
          console.log("fetching from cache");

          const data = JSON.parse(dataCache);

          if (data.length < 1) {
            return basicApiErrorMessage("No data found", "data");
          }

          return {
            __typename: "PeakDemandData",
            output: data,
          };
        }
        const query = `SELECT pageviews,sessions,visit_hour, pagesPerSession, aveSessionDuration,time_on_page, last_day
        FROM \`dta_customers.${uaid}_peakdemand_24hrs_weekly_1\``;
        try {
          const [job] = await bigQuery.createQueryJob({
            query,
          });
          console.log(`Job ${job.id} started.`);

          const [rows] = await job.getQueryResults();

          if (rows.length > 0) {
            console.log(rows);
            await redis_client.set(
              `${REDIS_PEAK_DATA_PREFIX}${property_ua_id}`,
              JSON.stringify(rows),
              "ex",
              60 * 60 * 12
            );

            return {
              __typename: "PeakDemandData",
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
  },
};
