import * as express from "express";
import { Request, Response, NextFunction } from "express";
import { Property } from "../../entity/Property";
import { IProperty } from "../../types/other";
import * as _ from "lodash";
import { Agency } from "../../entity/Agency";
import {
  propertyArraySchema,
  ua_id_schema,
  updatePropertyField,
} from "./property_schemas";

const propertyRouter = express.Router();

/**
 * Accepts Array<IProperty> as body params
 */
propertyRouter.post(
  "/add",
  async (req: Request, res: Response, next: NextFunction) => {
    const bodyData = req.body as Array<IProperty>;

    // takes out duplicated items in array
    // FIX could use middleware for next two code blocks
    // FIX check if unique based on upper/lowercase?
    const uniqueData = _.uniqBy(bodyData, "ua_id");

    if (uniqueData.length !== bodyData.length) {
      return res.status(400).json({
        statusCode: 400,
        message:
          "You have entered two or more rows that have the same UAID. The UAID must be unique. No data was entered",
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
      message: `${properties.length} entries for property data added successfully`,
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

propertyRouter.delete(
  "/delete",
  (req: Request, res: Response, next: NextFunction) => {
    res.send("hello2");
  }
);

propertyRouter.put(
  "/edit/:ua_id_param",
  async (req: Request, res: Response, next: NextFunction) => {
    const { ua_id_param } = req.params;
    //validate query param
    try {
      await ua_id_schema.validate(ua_id_param, { abortEarly: true });
    } catch (errors) {
      return res
        .status(400)
        .json({ fieldErrors: errors.errors, statusCode: 400 });
    }

    //Find the property that needs updating
    const propertyToUpdate = await Property.findOne(
      { ua_id: ua_id_param },
      { relations: ["agency"] }
    );

    if (!propertyToUpdate) {
      return res.status(404).json({
        statusCode: 404,
        message: "Property with that UAID was not found",
      });
    }

    //validate
    try {
      await updatePropertyField.validate(req.body, { abortEarly: true });
    } catch (errors) {
      return res
        .status(400)
        .json({ fieldErrors: errors.errors, statusCode: 400 });
    }

    const {
      agencyId: newAgencyId,
      service_name: newServiceName,
      domain: newDomain,
      ua_id: newUAID,
    } = req.body;

    const newAgency = await Agency.findOne({ where: { id: newAgencyId } });

    const s = await Property.update(
      { ua_id: ua_id_param },
      {
        agency: newAgency ? newAgency : propertyToUpdate.agency,
        ua_id: newUAID ? newUAID : propertyToUpdate.ua_id,
        domain: newDomain ? newDomain : propertyToUpdate.domain,
        service_name: newServiceName
          ? newServiceName
          : propertyToUpdate.service_name,
      }
    );
    res.send("OKAY");
  }
);

export default propertyRouter;
