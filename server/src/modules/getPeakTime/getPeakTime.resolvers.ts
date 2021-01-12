import { ResolverMap } from "../../types/graphql-util";
import { IGetPeakDataType } from "../../types/schema";
import { basicApiErrorMessage } from "../../util/constants";
import { createMiddleware } from "../../util/createMiddleware";
import { validatePeakDataRequest } from "./validatePeakDataReq";

require("dotenv").config();

export const resolvers: ResolverMap = {
  Query: {
    getPeakData: createMiddleware(
      validatePeakDataRequest,
      async (_, args: IGetPeakDataType, { session, redis_client }) => {
        //use session data
        const { property_ua_id } = args;

        const uaid = property_ua_id.toLowerCase().replace(/-/g, "_");

        const dataCache = await redis_client.get(`peakData:${property_ua_id}`);

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
          await redis_client.setex(`peakData:${property_ua_id}`, 120, data);

          return {
            __typename: "PeakDataResult",
            message: data,
          };
        }
      }
    ),
  },
};
