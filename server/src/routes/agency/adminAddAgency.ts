import * as express from "express";
import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import { Agency } from "../../entity/Agency";
import * as _ from "lodash";
import { IAgency } from "../../types/other";
// import * as _ from "lodash"

const agencyRouter = express.Router();

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
agencyRouter.post(
  "/add",
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req.body as Array<IAgency>;
    //do unique items in array
    const uniqueData = _.uniqBy(data, "name");
    if (uniqueData.length < 1) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "There were no unique items found in the data you have posted.",
      });
    }

    try {
      await agencyValidationSchema.validate(uniqueData, { abortEarly: false });
    } catch (errors) {
      return res
        .status(400)
        .json({ fieldErrors: errors.errors, statusCode: 400 });
    }

    const agencies = uniqueData as Array<IAgency>;

    // let errors;
    agencies.forEach(async (agency) => {
      const agencyToInsert = Agency.create({ name: agency.name });
      await agencyToInsert.save();
    });

    res.status(200).json({
      statusCode: 200,
      message: `${agencies.length} entries for agency data added successfully`,
    });
  }
);

agencyRouter.get(
  "/view",
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await Agency.find();
    return res.status(200).json(data);
  }
);

agencyRouter.put(
  "/delete",
  (req: Request, res: Response, next: NextFunction) => {
    res.send("hello2");
  }
);

agencyRouter.put(
  "/edit:id",
  (req: Request, res: Response, next: NextFunction) => {}
);

export default agencyRouter;
