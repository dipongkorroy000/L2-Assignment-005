/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, Response } from "express";
import statusCode from "http-status-codes";
import CustomError from "../errorHelper/CustomError";

interface TErrorSources {
  path: string;
  message: string;
}

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  let status = statusCode.BAD_REQUEST;
  let message = `Something Went Wrong!`;

  const errorSources: TErrorSources[] = [];

  if (err instanceof CustomError) {
    status = err.status;
    message = err.message;
  } else if (err instanceof Error) {
    status = statusCode.BAD_REQUEST;
    message = err.message;
  }

  if (err.code === 11000) {
    const matchedArray = err.message.match(/"([^"]*)"/);
    message = `${matchedArray[1]} Already Exist!!`;
  }

  if (err.name === "CastError") {
    message = `Invalid MongoDB objectId. Please provide a valid ObjectId. ${err.name}`;
  }

  if (err.name === "ValidationError") {
    const errorsArray = Object.values(err.errors);
    errorsArray.forEach((errorObj: any) => errorSources.push({ path: errorObj.path, message: errorObj.message }));
  }

  if (err.name === "ZodError") {
    status = statusCode.EXPECTATION_FAILED;
    message = "zodError";

    err.issues.forEach((issue: any) => {
      errorSources.push({
        path: issue.path[issue.path.length - 1],
        message: issue.message,
      });
    });
  }

  res.status(status).json({
    success: false,
    message: message,
    errorSources,
    // err: envVars.NODE_ENV === "development" ? err : null,
    // stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
