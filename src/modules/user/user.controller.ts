import { Request, Response } from "express";
import { UserService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await UserService.createUser(payload);

  sendResponse(res, { status: status.CREATED, success: true, data: result, message: "User created successfully" });
});

export const UserControllers = {
  createUser,
};
