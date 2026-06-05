import { Router } from "express";
import { vendorRoutes } from "../modules/vendor/vendor.routes";
import { customerRoutes } from "../modules/customer/customer.routes";
import { authRoutes } from "../modules/auth/auth.routes";
const router = Router();
const modulesRoutes = [
  {
    path: "/vendors",
    route: vendorRoutes,
  },
  {
    path: "/customers",
    route: customerRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
