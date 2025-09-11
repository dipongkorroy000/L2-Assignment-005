/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status-codes";
import CustomError from "../../errorHelper/CustomError";
import bcrypt from "bcryptjs";
import { User } from "../user/user.model";
import { createUserTokens } from "../../utils/generateToken";
import { IUser } from "../user/user.interface";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });
  if (!isUserExist) throw new CustomError(httpStatus.BAD_REQUEST, "Email does not exist");

  const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string);
  if (!isPasswordMatched) throw new CustomError(httpStatus.BAD_REQUEST, "Incorrect Password");

  const userTokens = createUserTokens(isUserExist);

  const { password: pass, ...rest } = isUserExist.toObject();

  return { accessToken: userTokens.accessToken, refreshToken: userTokens.refreshToken, user: rest };
};

export const AuthService = { credentialLogin };
