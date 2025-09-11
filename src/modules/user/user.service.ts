import CustomError from "../../errorHelper/CustomError";
import { User } from "./user.model";
import status from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { IAuthProvider, IUser } from "./user.interface";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) throw new CustomError(status.BAD_REQUEST, "Already user exist");

  const hashedPass = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

  const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };

  const user = await User.create({ email, password: hashedPass, auths: [authProvider], ...rest });

  return user;
  // -------
};

export const UserService = { createUser };
