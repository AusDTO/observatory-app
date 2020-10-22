import * as yup from "yup";
import { noUnknownMessage, ua_id_schema } from "../../util/yup";
import { DataOutputType } from "../../types/schema";

export const outputParamSchema = yup.object().shape({
  ua_id: ua_id_schema,
});

export const topTenStats = yup
  .array()
  .of(
    yup
      .object()
      .shape({
        pageUrl: yup.string().required(),
        pageTitle: yup.string().required(),
        pageViews: yup.string().required(),
        rank: yup.string().required(),
        percentage: yup.string().required(),
      })
      .required()
  )
  .required();

export const ExecDataSchemaDaily = yup
  .object()
  .noUnknown(true, function (a) {
    return noUnknownMessage(a);
  })
  .shape({
    pageViews: yup.string().required(),
    sessions: yup.string().required(),
    timeOnPage: yup.string().required(),
    bounceRate: yup.string().required(),
    aveSessionsPerUser: yup.string().required(),
    pagesPerSession: yup.string().required(),
    aveSessionDuration: yup.string().required(),
    users: yup.string().required(),
    newUsers: yup.string().required(),
    returningUsers: yup.string().required(),
    topTen: topTenStats,
    topTenGrowth: topTenStats,
    date: yup.string().required(), //FIX: should be properly formatted date
  });

export const ExecDataSchemaWeekly = yup
  .object()
  .noUnknown(true, function (a) {
    return noUnknownMessage(a);
  })
  .shape({
    pageViews: yup.string().required(),
    sessions: yup.string().required(),
    timeOnPage: yup.string().required(),
    bounceRate: yup.string().required(),
    aveSessionsPerUser: yup.string().required(),
    pagesPerSession: yup.string().required(),
    aveSessionDuration: yup.string().required(),
    users: yup.string().required(),
    newUsers: yup.string().required(),
    returningUsers: yup.string().required(),
    topTen: topTenStats,
    topTenGrowth: topTenStats,
    dateEnding: yup.string().required(),
  });

export const ExecDataSchemaHourly = yup
  .object()
  .noUnknown(true, function (a) {
    return noUnknownMessage(a);
  })
  .shape({
    pageViews: yup.string().required(),
    sessions: yup.string().required(),
    timeOnPage: yup.string().required(),
    bounceRate: yup.string().required(),
    aveSessionsPerUser: yup.string().required(),
    pagesPerSession: yup.string().required(),
    aveSessionDuration: yup.string().required(),
    users: yup.string().required(),
    newUsers: yup.string().required(),
    returningUsers: yup.string().required(),
    visit_hour: yup.string().required(),
  });

export const ArrayExecDataDaily = yup.array().of(ExecDataSchemaDaily);
export const ArrayExecDataWeekly = yup.array().of(ExecDataSchemaWeekly);
export const ArrayExecDataHourly = yup.array().of(ExecDataSchemaHourly);

export const LeastUsedSchema = yup.object().shape({
  pageViews: yup.string().required(),
  exits: yup.string().required(),
  timeOnPage: yup.string().required(),
  percentageDecline: yup.string().required(),
});

export const ArrayLeastUsed = yup.array().of(LeastUsedSchema);

export const dataTypeSchema = yup.mixed<DataOutputType>().required();
