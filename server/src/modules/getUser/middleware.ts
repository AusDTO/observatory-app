import { Resolver } from "../../types/graphql-util";

const middleware = async (
  resolver: Resolver,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  // middleware
  const result = await resolver(parent, args, context, info);
  // afterware

  return result;
};

export default middleware;
