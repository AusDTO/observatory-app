import { User } from "../../entity/User";
import { emailValidator, passwordValidator } from "../../util/yup";
import * as express from "express";
import * as yup from "yup";
const loginAdminRouter = express.Router();
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../util/constants";

const loginValidationSchema = yup.object().shape({
  email: emailValidator,
  password: passwordValidator,
});

loginAdminRouter.post("/login", async (req, res, next) => {
  try {
    await loginValidationSchema.validate(req.body, { abortEarly: false });
  } catch (errors) {
    res.status(400).json({ fieldErrors: errors.errors, statusCode: 400 });
    return next();
  }

  const { email, password } = req.body;
  const user = await User.findOne({
    where: { email },
    relations: ["agency"],
  });

  if (!user) {
    return res.status(401).json({
      statusCode: 401,
      message: "Bad credentials. Check email or user name again",
    });
  }

  //compare password to db
  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.status(401).json({
      statusCode: 401,
      message: "Bad credentials. Check email or user name again",
    });
  }

  if (!user.verified) {
    return res.status(403).json({
      statusCode: 403,
      message: "User has not been verified",
    });
  }

  if (!user.isAdmin) {
    return res.status(403).json({
      statusCode: 403,
      message: "You need admin access to login here",
    });
  }

  var token = jwt.sign({ isAdmin: true }, JWT_SECRET, {
    expiresIn: "6000s",
  });

  res.status(200).json({ statusCode: 200, accessToken: token });
});

export default loginAdminRouter;
