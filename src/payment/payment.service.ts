/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import CustomError from "../errorHelper/CustomError";
import { Parcel } from "../modules/parcel/parcel.model";
import { Payment_Status } from "../modules/parcel/parcel.interface";

const successPayment = async (query: Record<string, string>) => {
  const session = await Parcel.startSession();
  session.startTransaction();

  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session: session }
    );

    if (!updatedPayment) throw new CustomError(httpStatus.OK, "Payment not found");

    const updatedParcel = await Parcel.findByIdAndUpdate(
      updatedPayment?.parcel,
      { payment: Payment_Status.COMPLETE },
      { new: true, runValidators: true, session }
    );

    if (!updatedParcel) throw new CustomError(401, "Parcel not found");

    await session.commitTransaction();
    session.endSession();
    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const PaymentService = {
  successPayment,
};
