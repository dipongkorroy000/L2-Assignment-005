import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../user/user.interface";
import { parcelController } from "./parcel.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createParcelSchema } from "./parcel.validation";

const route = Router();

route.post("/", validateRequest(createParcelSchema), authorize(Role.admin, Role.sender), parcelController.parcelRequest);

// parcel status change by admin
route.patch("/:parcelId", authorize(Role.admin), parcelController.parcelStatusUpdate)

export const ParcelRoute = route;
