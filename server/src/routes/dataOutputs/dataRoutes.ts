import * as express from "express";
import * as yup from "yup";
import { Request, Response, NextFunction } from "express";

import * as _ from "lodash";

import { validateReqUUID } from "../../util/middleware/validReqUuid";
import { Outputs } from "../../entity/Output";
import { Property } from "../../entity/Property";

const dataOutputRouter = express.Router();

/**
 * Accepts Array<IAgency>
 * E.g. [{"name": "DTA"}, {"name":"ATO"}]
 */
dataOutputRouter.post(
  "/:ua_id/:type",
  async (req: Request, res: Response, next: NextFunction) => {
    const { output } = req.body;
    const { type, ua_id } = req.params;
    //validate ua_id

    const property = await Property.findOne({ where: { ua_id } });
    if (!property) {
      return res.status(404).json({
        statusCode: 404,
        message: `Property with ua_id: ${ua_id} not found.`,
      });
    }
    console.log(property);
    const outputToInsert = Outputs.create({ output, type, property });
    outputToInsert.save();
    console.log(outputToInsert);
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
