import { ResolverMap } from "../../types/graphql-util";

export const resolvers: ResolverMap = {
  Query: {
    getuser: (_, args) => ({
      id: args.id,
      email: args.email,
    }),
    HelloWorld: () => "Hello WOrld!",
  },
};
