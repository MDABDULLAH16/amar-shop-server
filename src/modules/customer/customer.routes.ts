import { Router } from "express";
import { customerController } from "./customer.controller";

const router = Router();
router.post('/customer-register', customerController.createCustomerReq);

export const customerRoutes = router;