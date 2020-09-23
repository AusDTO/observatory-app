import * as express from "express";
import * as yup from "yup";
import { Request, Response, NextFunction } from "express";

import * as _ from "lodash";

import { validateReqUUID } from "../../util/middleware/validReqUuid";
import { Outputs } from "../../entity/Output";
import { Property } from "../../entity/Property";
import { ArrayBasicData, outputParamSchema } from "./outputSchemas";

const dataOutputRouter = express.Router();

/**
 * Accepts Array<IAgency>
 * E.g. [{"name": "DTA"}, {"name":"ATO"}]
 */
dataOutputRouter.post(
  "/:ua_id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { ua_id } = req.params;
    try {
      await outputParamSchema.validate(req.params, { abortEarly: true });
    } catch (errors) {
      return res.status(400).json({
        statusCode: 400,
        fieldErrors: errors.errors,
      });
    }
    const { output, type } = req.body;
    //validate ua_id

    try {
      await ArrayBasicData.validate(req.body, { abortEarly: true });
    } catch (errors) {
      return res.status(400).json({
        statusCode: 404,
        fieldErrors: errors.errors,
      });
    }

    const property = await Property.findOne({ where: { ua_id } });
    if (!property) {
      return res.status(404).json({
        statusCode: 404,
        message: `Property with ua_id: ${ua_id} not found.`,
      });
    }

    const outputFind = await Outputs.findOne({ where: { property, type } });
    if (outputFind) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "There is already an entry with this type and property ID. Use PUT method instead",
      });
    }

    const outputToInsert = Outputs.create({ output, type, property });
    const bldd = await outputToInsert.save();
    console.log(bldd);
    res.status(200).json({
      status: "POSTED",
    });
  }
);

dataOutputRouter.get(
  "/:name?",
  async (req: Request, res: Response, next: NextFunction) => {}
);

dataOutputRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {}
);

dataOutputRouter.put(
  "/:id",
  validateReqUUID,
  (req: Request, res: Response, next: NextFunction) => {
    res.send("valid uuid");
  }
);

export default dataOutputRouter;
