import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from "http-status-codes";
import CustomError from "../errorHelper/CustomError";
import { generateJWTToken, verifyJWTToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = { userId: user._id, email: user.email, role: user.role };

  const accessToken = generateJWTToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

  const refreshToken = generateJWTToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);

  return { accessToken, refreshToken };
};

export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = verifyJWTToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

  const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

  if (!isUserExist) {
    throw new CustomError(httpStatus.BAD_REQUEST, "User does not exist");
  }

  if (isUserExist.isActive === IsActive.blocked || isUserExist.isActive === IsActive.inActive) {
    throw new CustomError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
  }

  if (isUserExist.isDeleted) {
    throw new CustomError(httpStatus.BAD_REQUEST, "User is Deleted");
  }

  const jwtPayload = { userId: isUserExist._id, email: isUserExist.email, role: isUserExist.role };

  const accessToken = generateJWTToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

  return accessToken;
};