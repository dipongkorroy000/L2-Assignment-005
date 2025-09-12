import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { authorize } from "../../middlewares/authorize";
import { Role } from "./user.interface";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);

router.get("/:userId", authorize(...Object.values(Role)), UserControllers.getMe);

export const UserRoute = router;
