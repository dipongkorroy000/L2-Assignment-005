import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";

export const routes = Router();

const moduleRoutes = [{ path: "/user", route: UserRoute }];

moduleRoutes.forEach((route) => {
  routes.use(route.path, route.route);
});
