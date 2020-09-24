import * as yup from "yup";
import { ua_id_schema } from "../../util/yup";

export const outputParamSchema = yup.object().shape({
  ua_id: ua_id_schema,
});

export const BasicDataSchema = yup.object().shape({
  pageViews: yup.string().required(),
  sessions: yup.string().required(),
  ave_time_on_page: yup.string().required(),
  date: yup.string().required(),
});

export const ArrayBasicData = yup.array().of(BasicDataSchema);

export const LeastUsedSchema = yup.object().shape({
  pageViews: yup.string().required(),
  exits: yup.string().required(),
  ave_time_on_page: yup.string().required(),
  percentageDecline: yup.string().required(),
});

export const ArrayLeastUsed = yup.array().of(LeastUsedSchema);

export const dataTypeSchema = yup
  .string()
  .required()
  .oneOf(["weekly_basics", "weekly_content_useful"]);
