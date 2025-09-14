import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { envVars } from "../config/env";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import { SSLService } from "../sslCommerz/sslCommerz.service";

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.successPayment(query as Record<string, string>);

  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await PaymentService.failPayment(query as Record<string, string>);

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await PaymentService.cancelPayment(query as Record<string, string>);

  if (!result.success) {
    res.redirect(
      `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const nextTimePayment = catchAsync(async (req: Request, res: Response) => {
  const trackingId = req.params.trackingId;
  const result = await PaymentService.nextTimePayment(trackingId);
  sendResponse(res, { status: 201, success: true, message: "Payment done successfully", data: result });
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {

  await SSLService.validatePayment(req.body);

  sendResponse(res, {
    status: 200,
    success: true,
    message: "Payment validated successfully",
    data: null,
  });
});

export const PaymentController = {
  successPayment,
  failPayment,
  cancelPayment,
  nextTimePayment,
  validatePayment,
};
