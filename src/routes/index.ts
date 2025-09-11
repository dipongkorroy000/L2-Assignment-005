import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { AuthRoute } from "../modules/auth/auth.route";

export const routes = Router();

const moduleRoutes = [
  { path: "/user", route: UserRoute },
  { path: "/auth", route: AuthRoute },
];

moduleRoutes.forEach((route) => {
  routes.use(route.path, route.route);
});
