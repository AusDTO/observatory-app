import * as express from "express";
import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import { Agency } from "../../entity/Agency";
import * as _ from "lodash";
import { IAgency } from "../../types/other";
// import * as _ from "lodash"

const propertyRouter = express.Router();

const agencyValidationSchema = yup.array().of(
  yup.object().shape({
    name: yup
      .string()
      .required()
      .test({
        name: "Unique agency",
        message: "Agency already exists",
        test: async function (this, value) {
          const agencyExists = await Agency.findOne({ where: { name: value } });
          return agencyExists === undefined
            ? true
            : this.createError({
                message: `Agency *${value}* already exists. The data was not posted successfully`,
                path: "Agency name", // Fieldname
              });
        },
      }),
  })
);

/**
 * Accepts Array<IAgency>
 * E.g. [{"name": "DTA"}, {"name":"ATO"}]
 */
propertyRouter.post(
  "/add",
  async (req: Request, res: Response, next: NextFunction) => {}
);

propertyRouter.get(
  "/view",
  async (req: Request, res: Response, next: NextFunction) => {}
);

propertyRouter.put(
  "/delete",
  (req: Request, res: Response, next: NextFunction) => {
    res.send("hello2");
  }
);

propertyRouter.put(
  "/edit:id",
  (req: Request, res: Response, next: NextFunction) => {}
);

export default agencyRouter;
