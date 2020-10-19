import * as yup from "yup";
import { noUnknownMessage, ua_id_schema } from "../../util/yup";
import { DataOutputType } from "../../types/schema";

export const outputParamSchema = yup.object().shape({
  ua_id: ua_id_schema,
});

const pageViewsSchema = yup.string().required();
const sessionsSchema = yup.string().required();
const timeOnPageSchema = yup.string().required();
const bounceRateSchema = yup.string().required();
const aveSessionsPerUserSchema = yup.string().required();
const pagesPerSessionSchema = yup.string().required();
const aveSessionDurationSchema = yup.string().required();
const newUsersSchema = yup.string().required();
const returningUsersSchema = yup.string().required();
const usersSchema = yup.string().required();

export const ExecDataSchemaDaily = yup
  .object()
  .noUnknown(true, function (a) {
    return noUnknownMessage(a);
  })
  .shape({
    pageViews: pageViewsSchema,
    sessions: sessionsSchema,
    timeOnPage: timeOnPageSchema,
    bounceRate: bounceRateSchema,
    aveSessionsPerUser: aveSessionsPerUserSchema,
    pagesPerSession: pagesPerSessionSchema,
    aveSessionDuration: aveSessionDurationSchema,
    users: usersSchema,
    newUsers: newUsersSchema,
    returningUsers: returningUsersSchema,
    date: yup.string().required(), //FIX: should be properly formatted date
  });

export const ExecDataSchemaWeekly = yup
  .object()
  .noUnknown(true, function (a) {
    return noUnknownMessage(a);
  })
  .shape({
    pageViews: pageViewsSchema,
    sessions: sessionsSchema,
    timeOnPage: timeOnPageSchema,
    bounceRate: bounceRateSchema,
    aveSessionsPerUser: aveSessionsPerUserSchema,
    pagesPerSession: pagesPerSessionSchema,
    aveSessionDuration: aveSessionDurationSchema,
    users: usersSchema,
    newUsers: newUsersSchema,
    returningUsers: returningUsersSchema,
    dateEnding: yup.string().required(),
  });

export const ExecDataSchemaHourly = yup
  .object()
  .noUnknown(true, function (a) {
    return noUnknownMessage(a);
  })
  .shape({
    pageViews: pageViewsSchema,
    sessions: sessionsSchema,
    timeOnPage: timeOnPageSchema,
    bounceRate: bounceRateSchema,
    aveSessionsPerUser: aveSessionsPerUserSchema,
    pagesPerSession: pagesPerSessionSchema,
    aveSessionDuration: aveSessionDurationSchema,
    users: usersSchema,
    newUsers: newUsersSchema,
    returningUsers: returningUsersSchema,
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
