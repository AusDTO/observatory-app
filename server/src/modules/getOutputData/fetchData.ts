import { Property } from "../../entity/Property";
import { User } from "../../entity/User";
import { Resolver } from "../../types/graphql-util";
import { basicApiErrorMessage, basicApiMessage } from "../../util/constants";
import { formatYupError } from "../../util/formatYupError";
import * as yup from "yup";
import { ua_id_schema } from "../../util/yup";
import { validateReqUUID } from "../../util/middleware/validReqUuid";
import { getConnection } from "typeorm";
import { Outputs } from "../../entity/Output";
import { DataOutputType } from "../../types/schema";

const outputArgsSchema = yup.object().shape({
  property_ua_id: ua_id_schema,
});

const dataOutputTypeMap = {
  exec_daily: "ExecDailyArray",
  exec_weekly: "ExecWeeklyArray",
  exec_hourly: "ExecHourlyArray",
};

export const validateRequestAndFetchData = async (
  parent: any,
  args: any,
  context: any,
  info: any,
  type: DataOutputType
) => {
  // middleware

  const { userId } = context.session; //FIX, use types

  let agencyId = context.session.agencyId;

  const user = await User.findOne({
    where: { id: userId },
  });

  if (!user) {
    return basicApiErrorMessage("Not authenticated", "user");
  }

  try {
    await outputArgsSchema.validate(args, { abortEarly: false });
  } catch (errors) {
    return {
      __typename: "FieldErrors",
      errors: formatYupError(errors),
    };
  }

  const { property_ua_id } = args;

  const property = await Property.findOne({
    where: { ua_id: property_ua_id },
    relations: ["agency"],
  });

  if (!property) {
    return basicApiMessage(
      "InvalidProperty",
      `Property with ua_id: ${property_ua_id} was not found`
    );
  }

  if (property.agency.id !== agencyId) {
    return basicApiErrorMessage(
      "You don't have access to this properties data",
      "agency"
    );
  }

  const outputData = await getConnection()
    .createQueryBuilder()
    .select("output")
    .from(Outputs, "output")
    .where("output.type = :type AND output.property_id = :id", {
      id: property.id,
      type,
    })
    .getOne();

  if (!outputData) {
    return basicApiMessage(
      "NoOutputData",
      `No data of this type was found for property with UA_ID: ${property_ua_id}`
    );
  }

  return {
    __typename: dataOutputTypeMap[type],
    output: outputData.output,
  };

  // afterware
};
