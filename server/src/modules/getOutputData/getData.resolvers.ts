import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import { basicApiErrorMessage, basicApiMessage } from "../../util/constants";
import { Property } from "../../entity/Property";
import { DataOutputType, IGetOutputDataType } from "../../types/schema";
import * as yup from "yup";
import { ua_id_schema } from "../../util/yup";
import { formatYupError } from "../../util/formatYupError";
import { Outputs } from "../../entity/Output";
import { getConnection } from "typeorm";

const outputArgsSchema = yup.object().shape({
  type: yup
    .string()
    .required()
    .oneOf(["exec_weekly", "exec_daily", "exec_hourly"]), //FIX, should user DataOutputType
  property_ua_id: ua_id_schema,
});

const dataTypeMap = {
  exec_weekly: "ExecWeeklyArray",
  exec_daily: "ExecDailyArray",
  exec_hourly: "ExecHourlyArray",
};

export const resolvers: ResolverMap = {
  ExecData: {
    __resolveType(execData, context, info) {
      if (execData.dateEnding) {
        return "ExecWeekly";
      }

      if (execData.date) {
        return "ExecDaily";
      }

      if (execData.visit_hour) {
        return "ExecHourly";
      }

      return null;
    },
  },
  Query: {
    getOutputData: async (_, args: IGetOutputDataType, { session }) => {
      //use session data
      const { userId } = session;

      let agencyId = session.agencyId;

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

      const { type, property_ua_id } = args;

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
        __typename: "ExecDataArray",
        output: outputData.output,
      };
    },
  },
};
