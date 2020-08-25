import { Redis } from "ioredis";
import { Request, Response } from "express";

export interface Context {
  redis_client: Redis;
  url: string;
  session: Session;
  req: Request;
  res: Response;
}

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export type GraphQLMiddlewareFunc = (
  resolver: Resolver,
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}

export interface Session extends Express.Session {
  userId?: string;
  agencyId?: string;
}
