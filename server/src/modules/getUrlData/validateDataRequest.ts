import * as yup from "yup";
import { Property } from "../../entity/Property";
import { User } from "../../entity/User";
import { Resolver } from "../../types/graphql-util";
import { basicApiErrorMessage, basicApiMessage } from "../../util/constants";
import { formatYupError } from "../../util/formatYupError";
import { ua_id_schema } from "../../util/yup";

//Middleware to validate data request
const validationSchema = yup.object().shape({
  property_ua_id: ua_id_schema,
  url: yup.string().url(),
  dateType: yup.string().oneOf(["weekly", "lastday"]),
});

export const validateDataRequest = async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  const { userId, agencyId } = context.session;
  const { property_ua_id } = args;
  const { url } = args;

  try {
    await validationSchema.validate(args, {
      abortEarly: false,
    });
  } catch (errors) {
    return {
      __typename: "FieldErrors",
      errors: formatYupError(errors),
    };
  }

  if (!userId) {
    return basicApiErrorMessage("Not authenticated", "user");
  }

  const user = await User.findOne({
    where: { id: userId },
  });

  if (!user) {
    return basicApiErrorMessage("Not authenticated", "user");
  }

  const property = await Property.findOne({
    where: { ua_id: property_ua_id.toLowerCase() },
    relations: ["agency"],
  });

  if (!property) {
    return basicApiMessage(
      "InvalidProperty",
      `Property with ua_id: ${property_ua_id} was not found`
    );
  }
  if (!url.includes(property.domain)) {
    return basicApiErrorMessage(
      `The domain ${url} may not belong to the property with id : ${property_ua_id}`,
      "domain"
    );
  }

  if (property.agency.id !== agencyId) {
    return basicApiErrorMessage(
      "You don't have access to this properties data",
      "agency"
    );
  }
  const result = await resolver(parent, args, context, info);

  return result;
};
