import CustomError from "../../errorHelper/CustomError";
import { getTransactionId } from "../../utils/generateId";
import { User } from "../user/user.model";
import { IParcel, StatusLog, TParcelStatusLog } from "./parcel.interface";
import status from "http-status-codes";
import { Parcel } from "./parcel.model";
import { ISSLCommerz } from "../../sslCommerz/sslCommerz.interface";
import { SSLService } from "../../sslCommerz/sslCommerz.service";
import { Payment } from "../../payment/payment.model";
import { PAYMENT_STATUS } from "../../payment/payment.interface";

const parcelRequest = async (payload: Partial<IParcel>) => {
  const session = await Parcel.startSession();
  session.startTransaction();

  try {
    const { senderId, ...rest, weight = 1 } = payload;

    const senderInfo = await User.findById(senderId);
    if (!senderInfo) throw new CustomError(status.NOT_FOUND, "User not found");

    if (!senderInfo.phone || !senderInfo.address) throw new CustomError(status.BAD_REQUEST, "Please Update Your Profile to Book a Tour.");

    const trackingId = getTransactionId();

    const parcel = await Parcel.create([{ ...payload, trackingId: trackingId }], { session });

    const amount = 100 * weight;

    await Payment.create([{ parcel: parcel[0]._id, transactionId: trackingId, amount: amount, status: PAYMENT_STATUS.UNPAID }], {
      session,
    });

    const sslPayload: ISSLCommerz = {
      name: senderInfo.name,
      phoneNumber: senderInfo.phone as string,
      transactionId: trackingId,
      email: senderInfo.email,
      amount: amount,
      address: senderInfo.address,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    await session.commitTransaction();
    session.endSession();

    return sslPayment.redirectGatewayURL;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

  // return parcel;
};

const parcelStatusUpdate = async (adminName: string, parcelId: string, payload: TParcelStatusLog) => {
  if (!payload.location || !payload.note || !payload.status) {
    throw new CustomError(status.BAD_REQUEST, "More Data Needed");
  }

  const parcel = await Parcel.findById(parcelId);
  if (!parcel) {
    throw new CustomError(status.BAD_REQUEST, "Parcel Not Found");
  }

  const statusLog: StatusLog = {
    updatedBy: adminName,
    location: payload.location,
    note: payload.note,
    status: payload.status,
    timestamp: new Date(),
  };

  const updatedParcel = await Parcel.findByIdAndUpdate(
    parcelId,
    { $set: { status: payload.status }, $push: { statusLog: statusLog } },
    { new: true, runValidators: true }
  );

  return updatedParcel;
};

export const parcelService = { parcelRequest, parcelStatusUpdate };
