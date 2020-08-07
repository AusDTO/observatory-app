import { GraphQLMiddlewareFunc, Resolver } from "../types/graphql-util";

export const createMiddleware = (
  middlewareFunc: GraphQLMiddlewareFunc,
  resolverFunc: Resolver
) => {
  return (parent: any, args: any, context: any, info: any) =>
    middlewareFunc(resolverFunc, parent, args, context, info);
};
