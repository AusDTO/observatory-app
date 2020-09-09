import * as yup from "yup";
import { Agency } from "../../entity/Agency";
import { Property } from "../../entity/Property";

export const ua_id_schema = yup
  .string()
  .matches(
    /UA-[0-9]+$/,
    "You have entered a UAID that is not valid, check your data and try again"
  );

export const propertyField = yup.object().shape({
  ua_id: ua_id_schema.required().test({
    name: "Check dupe property",
    message: "Property already exists",
    test: async function (this, value) {
      const propertyExists = await Property.findOne({ ua_id: value });

      return propertyExists === undefined
        ? true
        : this.createError({
            message: `Property with ID *${value}* already exists. The data was not posted`,
            path: "Property Id", // Fieldname
          });
    },
  }),
  domain: yup.string().required(),
  service_name: yup.string().required(),
  agencyId: yup
    .string()
    .required()
    .uuid("Not a valid uuid was entered for agency ID")
    .test({
      name: "Check agency exists (it should)",
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

export const updatePropertyField = yup.object().shape({
  ua_id: ua_id_schema,
  domain: yup.string(),
  service_name: yup.string(),
  agencyId: yup
    .string()
    .uuid("Not a valid uuid was entered for agency ID")
    .test({
      name: "Agency exists",
      message: "Agency doesn't exist",
      test: async function (this, value) {
        if (!value) {
          return true;
        }
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

export const propertyArraySchema = yup.array().of(propertyField);
