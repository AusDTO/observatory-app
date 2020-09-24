import { Request, Response, NextFunction, response } from "express";
import {
  ArrayBasicData,
  ArrayLeastUsed,
  dataTypeSchema,
} from "./outputSchemas";

export const ValidateDataOutputType = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type } = req.body;
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
  next: NextFunction
) => {
  const { output, type } = req.body;

  let dataValidator;
  switch (type) {
    case "weekly_basics":
      dataValidator = ArrayBasicData;
      break;
    case "weekly_content_useful":
      dataValidator = ArrayLeastUsed;
      break;
    default:
      dataValidator = null;
      return res
        .status(400)
        .json({ statusCode: 400, message: "There was an unexpected error" });
  }

  try {
    await dataValidator.validate(output, { abortEarly: true });
  } catch (errors) {
    return res.status(400).json({
      statusCode: 400,
      fieldErrors: errors.errors,
    });
  }
  next();
};
