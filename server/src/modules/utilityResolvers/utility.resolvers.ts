import { ResolverMap } from "../../types/graphql-util";
import { IKeyValidType } from "../../types/schema";
import * as yup from "yup";
import { REDIS_FORGOT_PASSWORD_PREFIX } from "../../util/constants";

const loginValidationSchema = yup.object().shape({
  key: yup.string().required(),
});

export const resolvers: ResolverMap = {
  Query: {
    //   isLoggedIn: () => "Hello WOrld!",
    //   isResetLinkValid: async (_, args: IKeyValidType, { redis_client }) => {
    //     try {
    //       await loginValidationSchema.validate(args, { abortEarly: false });
    //     } catch (errors) {
    //       return false;
    //     }

    //     const { key } = args;

    //     const keyStoredInRedis = `${REDIS_FORGOT_PASSWORD_PREFIX}${key}`; //need to add prefix because that's how it is stored

    //     const result = await redis_client.get(keyStoredInRedis);

    //     if (!result) return false;

    //     return true;
    //   },
    HelloWorld: () => "Helloworld",
  },
};
