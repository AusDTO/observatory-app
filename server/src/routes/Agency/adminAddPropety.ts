import * as express from "express";
import * as yup from "yup";
const agencyRouter = express.Router();

const AgencyValidationSchema = yup.object().shape({
  name: yup.string().required("Please enter an agency"),
});
agencyRouter.post("/add", (req, res, next) => {
  res.send("hello");
});

agencyRouter.get("/view", (req, res, next) => {
  res.send("hello2");
});

agencyRouter.put("/delete", (req, res, next) => {
  console.log(req.session);
  res.send("hello2");
});

agencyRouter.put("/edit:id", (req, res, next) => {});

export default agencyRouter;
