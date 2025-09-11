import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";
import { ParcelRoute } from "../modules/parcel/parcel.route";
import { PaymentRoutes } from "../payment/payment.route";

export const routes = Router();

const moduleRoutes = [
  { path: "/user", route: UserRoute },
  { path: "/auth", route: AuthRoute },
  { path: "/parcel", route: ParcelRoute },
  { path: "/payment", route: PaymentRoutes },
];

moduleRoutes.forEach((route) => {
  routes.use(route.path, route.route);
});
