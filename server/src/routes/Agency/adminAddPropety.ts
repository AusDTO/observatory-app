import * as express from "express";
import * as yup from "yup";
import { Request, Response, NextFunction } from "express";
import { Agency } from "../../entity/Agency";

const agencyRouter = express.Router();

const agencyValidationSchema = yup.array().of(
  yup.object().shape({
    name: yup
      .string()
      .required()
      .test({
        name: "Unique agency",
        message: "Agency already exists",
        test: async (value) => {
          const agencyExists = await Agency.findOne({ where: { name: value } });
          return agencyExists !== undefined ? false : true;
        },
      }),
  })
);

agencyRouter.post(
  "/add",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await agencyValidationSchema.validate(req.body, { abortEarly: false });
    } catch (errors) {
      res.status(400).json({ fieldErrors: errors.errors, statusCode: 400 });
      return next();
    }

    // console.log(req.body);
    const agencies = req.body as Array<Agency>;

    // let errors;
    agencies.forEach(async (agency) => {
      const agencyToInsert = Agency.create({ name: agency.name });
      await agencyToInsert.save();
    });

    res.send("hello");
  }
);

agencyRouter.get("/view", (req: Request, res: Response, next: NextFunction) => {
  res.send("hello2");
});

agencyRouter.put(
  "/delete",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.session);
    res.send("hello2");
  }
);

agencyRouter.put(
  "/edit:id",
  (req: Request, res: Response, next: NextFunction) => {}
);

export default agencyRouter;
