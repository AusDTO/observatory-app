import { ResolverMap } from "../../types/graphql-util";
import { Property } from "../../entity/Property";
import { IGetPropertyType } from "../../types/schema";
import * as yup from "yup";
import { formatYupError } from "../../util/formatYupError";
import { basicApiErrorMessage } from "../../util/constants";
import { User } from "../../entity/User";

const propertyIDValidationSchema = yup.object().shape({
  propertyId: yup.string().required().uuid("We could not find the property"),
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

      const { propertyId } = args;

      const property = await Property.findOne({
        where: { id: propertyId },
        relations: ["agency"],
      });

      if (!property || !property.agency) {
        return basicApiErrorMessage("Property not found", "property");
      }
      // console.log(property);

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
