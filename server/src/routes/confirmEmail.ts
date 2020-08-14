import { Request, Response, NextFunction } from "express";
import { User } from "../entity/User";
import { Redis } from "ioredis";
import { FRONT_END_URL } from "../util/constants";

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
  redis_client: Redis
) => {
  const { id } = req.params;

  const userID = await redis_client.get(id);
  const user = await User.findOne({ where: { id: userID } });

  //invalid confirmation link
  if (!user) {
    res.redirect(`${FRONT_END_URL}/invalid-confirmation`);
    return next();
  }

  //If user is already verified delete key and redirect to welcome
  if (user && user.verified) {
    await redis_client.del(id);
    res.redirect(`${FRONT_END_URL}/welcome`);
    return next();
  }

  //user is not verified, they'll become verified
  if (!user.verified) {
    User.update({ id: user.id }, { verified: true });
    res.redirect(`${FRONT_END_URL}/welcome`);

    //delete redis key once it has been used
    await redis_client.del(id);
  }
};
