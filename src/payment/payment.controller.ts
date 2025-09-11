import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { envVars } from "../config/env";
import { catchAsync } from "../utils/catchAsync";

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentService.successPayment(query as Record<string, string>);

  if (result.success) {
    res.redirect(
      `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

export const PaymentController = {
  successPayment,
};
