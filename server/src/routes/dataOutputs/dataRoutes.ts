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
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { output, type, ua_id } = req.body;

    const property = await Property.findOne({ where: { ua_id } });
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
