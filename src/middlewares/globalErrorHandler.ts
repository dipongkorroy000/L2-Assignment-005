/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import statusCode from "http-status-codes";
import CustomError from "../errorHelper/CustomError";

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  let status = statusCode.BAD_REQUEST;
  let message = `Something Went Wrong!`;

  if (err instanceof CustomError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    status = statusCode.BAD_REQUEST;
    message = err.message;
  }

  res.status(status).json({
    success: false,
    message: message,
    // errorSources,
    err: envVars.NODE_ENV === "development" ? err : null,
    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
