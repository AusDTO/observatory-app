import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { AdminPayload, JwtPayload } from "../types/other";
import { JWT_SECRET } from "./constants";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  return jwt.verify(token, JWT_SECRET, (err: any, data: any) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    const jwtEncoded = data as JwtPayload;

    if (jwtEncoded && jwtEncoded.isAdmin) {
      return next();
    } else {
      return res.send("NOT ALLOWED");
    }
  });
};
