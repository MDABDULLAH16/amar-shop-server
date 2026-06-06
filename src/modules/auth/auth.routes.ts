import { Router } from "express";
import { authController } from "./auth.controller";
import { subdomainMiddleware } from "./../../middleware/subdomain";

const router = Router();
// router.post('/admin/login', authController.loginVendorAndAdminReq);
router.post("/login", authController.loginUserReq);



export const authRoutes = router;
