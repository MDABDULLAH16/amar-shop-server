import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.post("/admin-register", adminController.createAdminReq);
export const adminRoutes = router;
