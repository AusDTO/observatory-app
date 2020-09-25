import * as express from "express";
import { Request, Response, NextFunction } from "express";

import * as _ from "lodash";

import { validatePropertyExists } from "../../util/middleware/validReqUuid";
import { Outputs } from "../../entity/Output";
import { Property } from "../../entity/Property";
import {
  ValidateDataOutput,
  ValidateDataOutputType,
} from "./validateDataSchemas";
import { DataOutputType } from "../../types/schema";
import { getConnection } from "typeorm";

const dataOutputRouter = express.Router();

/**
 * Accepts Array<IAgency>
 * E.g. [{"name": "DTA"}, {"name":"ATO"}]
 */
dataOutputRouter.post(
  "/:ua_id",
  validatePropertyExists,
  ValidateDataOutputType,
  ValidateDataOutput,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ua_id } = req.params;

    const { output, type } = req.body;

    // We know it exists since have checked in validatePropertyExists middleware
    const property = (await Property.findOne({ where: { ua_id } })) as Property;

    // Check if the there is already an entry with this data
    const outputFind = await Outputs.findOne({ where: { property, type } });
    if (outputFind) {
      return res.status(409).json({
        statusCode: 409,
        message: `There is already an entry with type: ${type} and ua_id: ${ua_id}. Use PUT method instead`,
      });
    }

    const outputToInsert = Outputs.create({ output, type, property });
    await outputToInsert.save();

    res.status(200).json({
      statusCode: 200,
      message: `Successfully entered ${output.length} rows of type:${type} for property: ${property.service_name}`,
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
  "/:ua_id",
  validatePropertyExists,
  ValidateDataOutputType,
  ValidateDataOutput,
  async (req: Request, res: Response, next: NextFunction) => {
    const type = req.query.type as DataOutputType;
    const { ua_id } = req.params;
    const { output } = req.body;

    // We know it exists since have checked in validatePropertyExists middleware
    const property = (await Property.findOne({ where: { ua_id } })) as Property;

    const updateResult = await getConnection()
      .createQueryBuilder()
      .update(Outputs)
      .set({ output })
      .where("type = :type AND property_id = :id", {
        id: property.id,
        type,
      })
      .execute();

    res.send("SUCCESS");
  }
);

export default dataOutputRouter;
