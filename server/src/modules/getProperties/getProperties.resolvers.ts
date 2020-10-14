import { ResolverMap } from "../../types/graphql-util";
import { User } from "../../entity/User";
import { basicApiErrorMessage, basicApiMessage } from "../../util/constants";
import { Property } from "../../entity/Property";

export const resolvers: ResolverMap = {
  Query: {
    getUserProperties: async (_, __, { session }) => {
      //use session data
      const { userId } = session;

      let agencyId = session.agencyId;

      const user = await User.findOne({
        where: { id: userId },
        relations: ["agency"],
      });

      if (!user) {
        return basicApiErrorMessage("Not authenticated", "user");
      }

      if (!agencyId && !user.agency) {
        return basicApiErrorMessage(
          "Your agency has not been added to ObservatoryApp",
          "Agency"
        );
      }

      //This case is for when agency is added while user is logged in and makes this request
      if (!agencyId && user.agency) {
        agencyId = user.agency.id;
        session.agencyId = user.agency.id;
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
