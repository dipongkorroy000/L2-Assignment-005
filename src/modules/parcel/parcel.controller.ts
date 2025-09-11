import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { parcelService } from "./parcel.service";

const parcelRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await parcelService.parcelRequest(req.body);
  // -----
});

export const parcelController = { parcelRequest };
