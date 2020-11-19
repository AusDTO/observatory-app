import { ResolverMap } from "../../types/graphql-util";
import { Property } from "../../entity/Property";
import { IGetDataFromUrlType, IGetPropertyType } from "../../types/schema";
import * as yup from "yup";
import { formatYupError } from "../../util/formatYupError";
import { basicApiErrorMessage } from "../../util/constants";
import { User } from "../../entity/User";
import { ua_id_schema } from "../../util/yup";

const validationSchema = yup.object().shape({
  property_ua_id: ua_id_schema,
  url: yup.string().url()
});

export const resolvers: ResolverMap = {
  Query: {
    getDataFromUrl: async (_, args: IGetDataFromUrlType, { session }) => {
      //use session data

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


      return {
       __typename: "Message",   
        message: "Hello"
      }
    },
  },
};
