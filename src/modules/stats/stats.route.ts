import express from "express";
import { Role } from "../user/user.interface";
import { StatsController } from "./stats.controller";
import { authorize } from "../../middlewares/authorize";

const router = express.Router();

router.get("/user", authorize(Role.admin), StatsController.getUserStats);
router.get("/parcel", authorize(Role.admin), StatsController.getParcelStats);
router.get("/payment", authorize(Role.admin), StatsController.getPaymentStats);

export const StatsRoute = router; 
