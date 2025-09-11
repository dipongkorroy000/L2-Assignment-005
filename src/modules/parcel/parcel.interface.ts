import { Types } from "mongoose";

export enum Status {
  requested = "REQUESTED",
  picked = "APPROVED",
  in_transit = "IN-TRANSIT",
  DISPATCHED = "DISPATCHED",
  delivered = "DELIVERED",
  blocked = "BLOCKED",
}

export interface Receiver {
  name: string;
  phone: string;
  address: string;
  timestamp: Date;
}

export interface StatusLog {
  status: Status;
  updatedBy: string;
  location: string;
  note: string;
}

export enum Payment_Status {
  PENDING = "PENDING",
  CANCEL = "CANCEL",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
}

export interface IParcel {
  senderId: Types.ObjectId;
  title: string;
  type: string;
  weight: number;
  trackingId: string;
  division: string;
  city: string;
  area: string;
  receiverId?: Types.ObjectId;
  status: Status;
  payment: Payment_Status;
  statusLog?: StatusLog[];
}
