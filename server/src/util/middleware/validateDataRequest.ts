import { Property } from "../../entity/Property";
import { User } from "../../entity/User";
import { basicApiErrorMessage, basicApiMessage } from "../constants";

export const validateDataRequest = async (
  userId: string | undefined,
  property_ua_id: string,
  agencyId: string | undefined
) => {
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

  if (property.agency.id !== agencyId) {
    return basicApiErrorMessage(
      "You don't have access to this properties data",
      "agency"
    );
  }
};
