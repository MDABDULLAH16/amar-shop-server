import { Router } from "express";
import { authController } from "./auth.controller";
import { subdomainMiddleware } from "./../../middleware/subdomain";

const router = Router();

router.use(subdomainMiddleware);
router.post("/login", authController.loginUserReq);

export const authRoutes = router;
