import { Router } from "express";
import { vendorController } from "./vendor.controller";
import { authorizeRoles } from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();
router.post("/vendor-register", vendorController.createVendorReq);
router.use(authorizeRoles(Role.VENDOR));

export const vendorRoutes = router;
