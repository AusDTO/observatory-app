import { Request, Response, NextFunction } from "express";
import {
  ArrayBasicData,
  ArrayLeastUsed,
  dataTypeSchema,
} from "./outputSchemas";

export const ValidateType = async (
  req: Request,
  res: Response,
  next: NextFunction,
  type: string | undefined
) => {
  try {
    await dataTypeSchema.validate(type, { abortEarly: true });
  } catch (errors) {
    return res.status(400).json({
      statusCode: 404,
      fieldErrors: errors.errors,
    });
  }
  next();
};

export const ValidateDataOutput = async (
  req: Request,
  res: Response,
  next: NextFunction,
  type: string,
  body: any
) => {
  let dataValidator;
  switch (type) {
    case "weekly_basics":
      dataValidator = ArrayBasicData;
      break;
    case "weekly_content_useful":
      dataValidator = ArrayLeastUsed;
      break;
  }

  try {
    await dataValidator?.validate(body, { abortEarly: true });
  } catch (errors) {
    return res.status(400).json({
      statusCode: 400,
      fieldErrors: errors.errors,
    });
  }
};
