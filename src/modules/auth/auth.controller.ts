import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthService.credentialLogin(req.body);

  sendResponse(res, { status: httpStatus.OK, success: true, message: "Login Successfully", data: loginInfo });
  // ---
});

export const AuthController = { credentialLogin };
