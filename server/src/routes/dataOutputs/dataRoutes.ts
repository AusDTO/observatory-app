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
  "/:ua_id?",
  validatePropertyExists,
  async (req: Request, res: Response, next: NextFunction) => {
    const { ua_id } = req.params;

    //we know property exists because of middleware does the checking
    let data;
    if (ua_id) {
      // const property = await Property.findOne({ where: { ua_id } });
      data = await getConnection()
        .createQueryBuilder()
        .select("property")
        .from(Property, "property")
        .leftJoinAndSelect("property.outputs", "outputs")
        .where("property.ua_id = :id", { id: ua_id })
        .getMany();
    } else {
    }

    res.status(200).json(data);
  }
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
    //have validated the folowing 3 in the middleware
    const type = req.query.type as DataOutputType; //query param
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

    res.status(200).json({
      statusCode: 200,
      message: `Updated the ${type} dataset for property: ${property.domain}`,
    });
  }
);

export default dataOutputRouter;
