import { Router } from "express";
import { authorize } from "../../middlewares/authorize";
import { Role } from "../user/user.interface";
import { parcelController } from "./parcel.controller";

const route = Router();

route.post("/", authorize(Role.admin, Role.sender), parcelController.parcelRequest);

export const ParcelRoute = route;
