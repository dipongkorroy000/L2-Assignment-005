import { Date, Types } from "mongoose";

export enum PAYMENT_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  CANCEL = "CANCEL",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface IPayment {
  parcel: Types.ObjectId;
  transactionId: string;
  amount: number;
  status: PAYMENT_STATUS;
  invoiceUrl?: string;
  createdAt?: Date;
}
