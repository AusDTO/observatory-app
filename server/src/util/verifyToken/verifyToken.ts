import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "../../types/other";
import { JWT_SECRET } from "../constants";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null)
    return res.status(401).json({
      statusCode: 401,
      message: '"No token provided or not authorised"',
    });

  jwt.verify(token, JWT_SECRET, (err: any, data: any) => {
    if (err)
      return res
        .status(403)
        .json({ statusCode: 403, message: "JWT token error" });

    const jwtEncoded = data as JwtPayload;

    if (jwtEncoded && jwtEncoded.isAdmin) {
      return next();
    } else {
      return res
        .status(403)
        .json({ statusCode: 403, message: "Not an admin or JWT expired" });
    }
  });
  return undefined;
};
