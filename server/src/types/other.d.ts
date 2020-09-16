import { Request, NextFunction } from "express";

export interface AdminPayload {
  isAdmin: boolean;
}

interface JwtPayload {
  isAdmin: boolean;
  iat: number;
  exp: number;
}

interface ResponseError extends Error {
  statusCode: number;
}

export type ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => any;

interface IAgency {
  name: string;
  emailHosts: string[];
}

interface IProperty {
  ua_id: string;
  domain: string;
  service_name: string;
  agencyId: string;
}

declare module "yup" {
  // tslint:disable-next-line
  interface ArraySchema<T> {
    unique(mapper: (a: T) => T, message?: any): ArraySchema<T>;
  }
}
