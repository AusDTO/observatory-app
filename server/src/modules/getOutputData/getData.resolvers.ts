import { ResolverMap } from "../../types/graphql-util";

import { IGetOutputDataType } from "../../types/schema";

import { validateRequestAndFetchData } from "./fetchData";

export const resolvers: ResolverMap = {
  Query: {
    getExecDailyData: async (_, args: IGetOutputDataType, context, info) => {
      const res = await validateRequestAndFetchData(
        _,
        args,
        context,
        info,
        "exec_daily"
      );
      return res;
    },
    getExecWeeklyData: async (_, args: IGetOutputDataType, context, info) => {
      const res = await validateRequestAndFetchData(
        _,
        args,
        context,
        info,
        "exec_weekly"
      );
      return res;
    },
    getExecHourlyData: async (_, args: IGetOutputDataType, context, info) => {
      const res = await validateRequestAndFetchData(
        _,
        args,
        context,
        info,
        "exec_hourly"
      );
      return res;
    },
  },
};
