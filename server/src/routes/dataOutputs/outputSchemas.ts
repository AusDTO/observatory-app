import * as yup from "yup";
import { ua_id_schema } from "../../util/yup";
import { DataOutputType } from "../../types/schema";

export const outputParamSchema = yup.object().shape({
  ua_id: ua_id_schema,
});

export const BasicDataSchemaDaily = yup.object().shape({
  pageViews: yup.string().required(),
  sessions: yup.string().required(),
  timeOnPage: yup.string().required(),
  bounceRate: yup.string().required(),
  date: yup.string().required(),
});

export const ArrayBasicDataDaily = yup.array().of(BasicDataSchemaDaily);

export const LeastUsedSchema = yup.object().shape({
  pageViews: yup.string().required(),
  exits: yup.string().required(),
  timeOnPage: yup.string().required(),
  percentageDecline: yup.string().required(),
});

export const ArrayLeastUsed = yup.array().of(LeastUsedSchema);

export const dataTypeSchema = yup.mixed<DataOutputType>().required();
