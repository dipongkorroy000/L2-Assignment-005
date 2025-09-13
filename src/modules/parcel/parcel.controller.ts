import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { parcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";
import { verifyJWTToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import CustomError from "../../errorHelper/CustomError";
import status from "http-status-codes";

const parcelRequest = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await parcelService.parcelRequest(payload);

  sendResponse(res, { status: statusCode.OK, success: true, message: "parcel deliver requested successfully", data: result });
});

const parcelStatusUpdate = catchAsync(async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization;
  const parcelId = req.params.parcelId;
  const payload = await req.body;
  if (!accessToken) throw new CustomError(status.BAD_REQUEST, "No Token Received");
  const verifiedToken = verifyJWTToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;
  const admin = await User.findOne({ email: verifiedToken.email });
  if (!admin) throw new CustomError(status.BAD_REQUEST, "User Not Found");

  const result = await parcelService.parcelStatusUpdate(admin.name, parcelId, payload);

  sendResponse(res, { status: status.OK, success: true, message: "Parcel Updated Successfully", data: result });
  // -----
});

const cancelParcel = catchAsync(async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;

  const feedBack = await req.body?.feedBack;

  const result = await parcelService.cancelParcel(trackingId, feedBack);

  sendResponse(res, { status: status.OK, success: true, message: "Parcel has Cancel", data: result });

  // -----
});

const myParcels = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await parcelService.myParcels(userId);

  sendResponse(res, { status: status.OK, success: true, message: "My Parcels retrieved successfully", data: result });
});

export const parcelController = { parcelRequest, parcelStatusUpdate, myParcels, cancelParcel };
