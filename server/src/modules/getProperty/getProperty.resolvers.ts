import { ResolverMap } from "../../types/graphql-util";
import { Property } from "../../entity/Property";
import { IGetPropertyType } from "../../types/schema";
import * as yup from "yup";
import { formatYupError } from "../../util/formatYupError";
import { basicApiErrorMessage } from "../../util/constants";
import { User } from "../../entity/User";
import { ua_id_schema } from "../../util/yup";

const propertyIDValidationSchema = yup.object().shape({
  propertyId: ua_id_schema,
});

export const resolvers: ResolverMap = {
  Query: {
    getProperty: async (_, args: IGetPropertyType, { session }) => {
      //use session data
      try {
        await propertyIDValidationSchema.validate(args, {
          abortEarly: false,
        });
      } catch (errors) {
        return {
          __typename: "FieldErrors",
          errors: formatYupError(errors),
        };
      }

      const { agencyId, userId } = session;

      const user = await User.findOne({
        where: { id: userId },
      });

      if (!user) {
        return basicApiErrorMessage("Not authenticated", "user");
      }

      const { property_ua_id } = args;

      const property = await Property.findOne({
        where: { ua_id: property_ua_id },
        relations: ["agency"],
      });

      if (!property || !property.agency) {
        return basicApiErrorMessage("Property not found", "property");
      }

      //check if user has access to this property data
      if (property.agency.id !== agencyId) {
        return basicApiErrorMessage(
          "You don't have access to this property",
          "service"
        );
      }

      const { service_name, ua_id, domain, id, agency } = property;

      return {
        __typename: "Property",
        ua_id,
        service_name,
        domain,
        id,
        agency,
      };
    },
  },
};
