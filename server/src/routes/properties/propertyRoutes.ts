import * as express from "express";
import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import { Property } from "../../entity/Property";
import { IProperty } from "../../types/other";
import * as _ from "lodash";
import { Agency } from "../../entity/Agency";

const propertyRouter = express.Router();

const propertyField = yup.object().shape({
  ua_id: yup
    .string()
    .required()
    .matches(
      /UA-[0-9]+$/,
      "You have entered a UAID that is not valid, check your data and try again"
    ),
  domain: yup.string().required(),
  service_name: yup.string().required(),
  agencyId: yup
    .string()
    .required()
    .uuid("Not a valid uuid was entered for agency ID")
    .test({
      name: "Agency exists",
      message: "Agency doesn't exist",
      test: async function (this, value) {
        const agencyExists = await Agency.findOne({ id: value });

        return agencyExists !== undefined
          ? true
          : this.createError({
              message: `Agency with ID *${value}* does not exist. The data was not posted`,
              path: "Agency Id", // Fieldname
            });
      },
    }),
});

const propertyArraySchema = yup.array().of(propertyField);

/**
 * Accepts Array<IProperty> as body params
 */
propertyRouter.post(
  "/add",
  async (req: Request, res: Response, next: NextFunction) => {
    const bodyData = req.body as Array<IProperty>;

    // takes out duplicated items in array
    // FIX could use middleware for next two code blocks
    const uniqueData = _.uniqBy(bodyData, "ua_id");

    if (uniqueData.length < 1) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "There were no unique items found in the data you have posted.",
      });
    }

    try {
      await propertyArraySchema.validate(bodyData, { abortEarly: true });
    } catch (errors) {
      return res
        .status(400)
        .json({ fieldErrors: errors.errors, statusCode: 400 });
    }

    const properties = uniqueData as Array<IProperty>;

    properties.forEach(async (property) => {
      const { ua_id, service_name, domain, agencyId } = property;
      //Find agency object. We have already validated if it exists using YUP
      const agency = await Agency.findOne({ where: { id: agencyId } });

      const propertyToInsert = Property.create({
        ua_id,
        service_name,
        domain,
      });
      propertyToInsert.agency = agency as Agency;
      await propertyToInsert.save();
    });

    res.status(200).json({
      statusCode: 200,
      message: `${properties.length} entries for agency data added successfully`,
    });
  }
);

propertyRouter.get(
  "/view",
  async (req: Request, res: Response, next: NextFunction) => {
    const properties = await Property.find({ relations: ["agency"] });
    return res.status(200).json(properties);
  }
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

export default propertyRouter;
