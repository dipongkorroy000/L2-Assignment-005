import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../user/user.interface";
import { parcelController } from "./parcel.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelSchema } from "./parcel.validation";

const route = Router();

route.post("/", validateRequest(createParcelSchema), authorize(Role.admin, Role.sender), parcelController.parcelRequest);

route.get("/all-parcel", authorize(Role.admin), parcelController.allParcels);

// receiver picked parcel by email or phone
route.patch("/confirm", parcelController.confirmParcel);

route.get("/:receiverId", authorize(Role.receiver), parcelController.receiverParcels);

// admin can get specific parcel
route.delete("/:trackingId", authorize(Role.admin), parcelController.deleteParcel);

route.get("/myParcels/:senderId", authorize(...Object.values(Role)), parcelController.senderParcels);

// parcel status change by admin
route.patch("/:parcelId", authorize(Role.admin), parcelController.parcelStatusUpdate);

export const ParcelRoute = route;
