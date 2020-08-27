import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import { basicApiErrorMessage, basicApiMessage } from "../../util/constants";
import { Property } from "../../entity/Property";

export const resolvers: ResolverMap = {
  Query: {
    getUserProperties: async (_, __, { session }) => {
      //use session data
      const { agencyId, userId } = session;

      const user = await User.findOne({
        where: { id: userId },
        relations: ["agency"],
      });

      if (!user) {
        return basicApiErrorMessage("Not authenticated", "user");
      }

      if (!agencyId) {
        return basicApiErrorMessage(
          "Your agency has not been added to ObservatoryApp",
          "Agency"
        );
      }

      const properties = await Property.find({
        where: { agency: agencyId },
        select: ["id", "ua_id", "domain", "service_name"],
      });

      if (properties.length < 1) {
        return basicApiMessage(
          "NoProperties",
          "Properties have not been found for your agency"
        );
      }

      return {
        __typename: "PropertyList",
        properties,
      };
    },
  },
};
