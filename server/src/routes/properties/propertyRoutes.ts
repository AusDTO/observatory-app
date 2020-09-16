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
  "/",
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
          "You have either entered rows with duplicate UAIDs, or are not passing an array of objects",
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
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const properties = await Property.find({ relations: ["agency"] });
    return res.status(200).json(properties);
  }
);

//FIX ADD TEST FOR THIS
propertyRouter.delete(
  "/:ua_id_param",
  async (req: Request, res: Response, next: NextFunction) => {
    const { ua_id_param } = req.params;
    try {
      await ua_id_schema.validate(ua_id_param, { abortEarly: true });
    } catch (errors) {
      return res
        .status(400)
        .json({ fieldErrors: errors.errors, statusCode: 400 });
    }

    const propertyExists = await Property.findOne({
      where: { ua_id: ua_id_param },
    });

    if (!propertyExists) {
      return res.status(400).json({
        statusCode: 400,
        message: "Property with that UAID doesn't exist",
      });
    }

    await Property.delete({ ua_id: ua_id_param });

    return res.status(200).json({
      statusCode: 200,
      message: `Deleted property ${propertyExists.service_name}`,
    });
  }
);

propertyRouter.put(
  "/:ua_id_param",
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

    //validate the body
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
    } = req.body;

    const newAgency = await Agency.findOne({ where: { id: newAgencyId } });

    const agency = newAgency ? newAgency : propertyToUpdate.agency;
    const ua_id = propertyToUpdate.ua_id;
    const domain = newDomain ? newDomain : propertyToUpdate.domain;
    const service_name = newServiceName
      ? newServiceName
      : propertyToUpdate.service_name;

    await Property.update(
      { ua_id: ua_id_param },
      {
        agency,
        domain,
        service_name,
      }
    );
    res.status(200).json({
      statusCode: 200,
      message: `Property updated: ${JSON.stringify({
        agency,
        ua_id,
        domain,
        service_name,
      })}`,
    });
  }
);

export default propertyRouter;
