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

interface Agency {
  name: string;
}
