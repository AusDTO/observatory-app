import { ResolverMap } from "../../types/graphql-util";

export const resolvers: ResolverMap = {
  Query: {
    getuser: () => ({
      username: "hello",
      password: "secreddt",
    }),
    register: () => "Registered",
  },
};
