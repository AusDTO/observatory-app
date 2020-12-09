import { ResolverMap } from "../../types/graphql-util";
import { IGetDataFromUrlType } from "../../types/schema";
import { basicApiErrorMessage, bigQuery } from "../../util/constants";
import { createMiddleware } from "../../util/createMiddleware";
import { validateDataRequest } from "./validateDataRequest";

require("dotenv").config();

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
          `urldata:${dateType}:${urlTrimmed}:${property_ua_id}`
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
              return basicApiErrorMessage(
                "No data found. Please try another url. Make sure you have included the protocol and www.",
                "data"
              );
            }
            const medium = [
              { medium: "desktop", views: rows[0].desktop },
              { medium: "mobile", views: rows[0].mobile },
              { medium: "tablet", views: rows[0].tablet },
            ];

            const source = [
              { source: "organic", views: rows[0].organic },
              { source: "referral", views: rows[0].referral },
              { source: "other", views: rows[0].other },
            ];

            const dataToReturn = [{ ...rows[0], source, medium }];

            await redis_client.set(
              `urldata:${dateType}:${urlTrimmed}:${property_ua_id}`,
              JSON.stringify(dataToReturn),
              "ex",
              60 * 60 * 12
            );

            return {
              __typename: "UrlDataResult",
              output: dataToReturn,
            };
          } catch (err) {
            console.error(err.errors);
            return basicApiErrorMessage(
              "There was an unexpected error fetching your data",
              "table"
            );
          }
        }
      }
    ),
  },
};
