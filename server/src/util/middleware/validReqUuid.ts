import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { ua_id_schema } from "../yup";

const validateIdParamSchema = yup.object().shape({
  id: yup
    .string()
    .required("ID was not passed in params")
    .uuid("The ID param is not a valid UUID"),
});

export const validateReqUUID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await validateIdParamSchema.validate(req.params, { abortEarly: false });
  } catch (errors) {
    return res
      .status(400)
      .json({ fieldErrors: errors.errors, statusCode: 400 });
  }
  next();
};

export const validateReqUAID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ua_id } = req.params;

  try {
    await ua_id_schema.validate(ua_id, { abortEarly: false });
  } catch (errors) {
    return res
      .status(400)
      .json({ fieldErrors: errors.errors, statusCode: 400 });
  }
  next();
};
