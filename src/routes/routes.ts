import { Router } from "express";
import { vendorRoutes } from "../modules/vendor/vendor.routes";
import { customerRoutes } from "../modules/customer/customer.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
const router = Router();
const modulesRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/vendors",
    route: vendorRoutes,
  },
  {
    path: "/customers",
    route: customerRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
