import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { authorize } from "../../middlewares/authorize";
import { Role } from "./user.interface";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);

// anyone use
router.get("/", authorize(...Object.values(Role)), UserControllers.getMe);

// update by query(email) user profile
router.patch("/", authorize(Role.sender, Role.receiver), UserControllers.updateProfile);

// admin routes
router.get("/all-users",authorize(Role.admin), UserControllers.getAllUsers);


export const UserRoute = router; 
