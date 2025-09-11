import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { parcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status-codes";

const parcelRequest = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await parcelService.parcelRequest(payload);

  sendResponse(res, { status: statusCode.OK, success: true, message: "parcel deliver requested successfully", data: result });
});

export const parcelController = { parcelRequest };
