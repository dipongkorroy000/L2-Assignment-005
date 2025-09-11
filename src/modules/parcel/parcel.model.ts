import { Schema, model } from "mongoose";
import { IParcel, Status, Payment_Status } from "./parcel.interface";

const statusLogSchema = new Schema({
  status: { type: String, enum: Object.values(Status), required: true },
  updatedBy: { type: String, required: true },
  location: { type: String, required: true },
  note: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now },
});

const parcelSchema = new Schema<IParcel>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: [true, "Please provide parcel title"] },
    type: { type: String, required: [true, "Please specify parcel type"] },
    weight: { type: Number, required: [true, "Please specify parcel weight"] },
    trackingId: { type: String, required: true, unique: true },
    division: { type: String, required: [true, "Please provide division"] },
    city: { type: String, required: [true, "Please provide city"] },
    area: { type: String, required: [true, "Please provide area"] },
    status: { type: String, enum: Object.values(Status), default: Status.requested },
    payment: { type: String, enum: Object.values(Payment_Status), default: Payment_Status.PENDING },
    statusLog: { type: [statusLogSchema], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Parcel = model<IParcel>("Parcel", parcelSchema);
