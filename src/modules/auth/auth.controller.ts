import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const credentialLogin = catchAsync(async (req: Request, res: Response) => {
  const loginInfo = await AuthService.credentialLogin(req.body, res);

  sendResponse(res, { status: httpStatus.OK, success: true, message: "Login Successfully", data: loginInfo });
  // ---
});

const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", { httpOnly: true, secure: false, sameSite: "lax" });
  res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "lax" });

  sendResponse(res, {
    success: true,
    status: httpStatus.OK,
    message: "Logout Successfully",
    data: null,
  });
});

export const AuthController = { credentialLogin, logout };
