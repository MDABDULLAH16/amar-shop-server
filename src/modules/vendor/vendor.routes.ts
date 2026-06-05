import { Router } from "express";
import { vendorController } from "./vendor.controller";

const router = Router();

router.post("/vendor-register", vendorController.createVendorReq);

export const vendorRoutes = router;
