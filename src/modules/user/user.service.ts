import CustomError from "../../errorHelper/CustomError";
import { User } from "./user.model";
import status from "http-status-codes";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { IAuthProvider, IUser, UpdateUser } from "./user.interface";

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

const getMe = async (email: string) => {
  const user = await User.findOne({email}).select("-password").select("-isDeleted");
  return user;
};

const updateProfile = async (email: string, payload: UpdateUser) => {
  const user = await User.findOne({ email });

  if (!user) throw new CustomError(status.NOT_FOUND, "User not found");

  const updateUser = await User.findByIdAndUpdate(user._id, { $set: { phone: payload.phone, address: payload.address } });

  return updateUser;
};

const getAllUsers = async () => {
  const users = await User.find({}).select("-password");
  const totalUsers = await User.countDocuments();

  return { data: users, meta: { total: totalUsers } };
};

export const UserService = { createUser, getMe, updateProfile, getAllUsers };
