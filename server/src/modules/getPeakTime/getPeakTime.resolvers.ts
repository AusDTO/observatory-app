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

        const query = `SELECT visit_hour,pageViews,sessions
        FROM \`dta_customers.${uaid}_peakseries_24hrs_weekly\` ORDER BY visit_hour`;
        try {
          const [job] = await bigQuery.createQueryJob({
            query,
          });
          console.log(`Job ${job.id} started.`);

          const [rows] = await job.getQueryResults();

          if (rows.length > 0) {
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
            ...data,
          };
        }
        const query = `SELECT pageViews,sessions,visit_hour, pagesPerSession, aveSessionDuration,timeOnPage, lastDay
        FROM \`dta_customers.${uaid}_peakdemand_24hrs_weekly_1\``;

        const query2 = `SELECT peakCount, peakTraffic 
        FROM \`dta_customers.${uaid}_peakdemand_24hrs_weekly_2\`
        LIMIT 10;
        `;

        const query3 = `SELECT pageUrl, pageTitle, pageCount
        FROM \`dta_customers.${uaid}_peakdemand_24hrs_weekly_3\`
        LIMIT 10;`;

        try {
          const [job1] = await bigQuery.createQueryJob({
            query,
          });
          console.log(`Job ${job1.id} started.`);
          const [rows1] = await job1.getQueryResults();

          const [job2] = await bigQuery.createQueryJob({ query: query2 });
          const [rows2] = await job2.getQueryResults();

          const [job3] = await bigQuery.createQueryJob({ query: query3 });
          const [rows3] = await job3.getQueryResults();

          if (rows1.length > 0 && rows2.length > 0 && rows3.length > 0) {
            const formattedData = {
              top10: rows3,
              referral: rows2,
              ...rows1[0],
            };

            await redis_client.set(
              `${REDIS_PEAK_DATA_PREFIX}${property_ua_id}`,
              JSON.stringify(formattedData),
              "ex",
              60 * 60 * 12
            );

            return {
              __typename: "PeakDemandData",
              ...formattedData,
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
