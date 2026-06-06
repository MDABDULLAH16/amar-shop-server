import { Router } from "express";
import { productController } from "./products.controller";
import { authenticate, authorizeRoles } from "../../middleware/auth";
import { Role } from "@prisma/client";

const router = Router();
router.use(authenticate);
router.use(authorizeRoles(Role.VENDOR));
router.post("/product-add", productController.productAddReq);

export const productRoutes = router;
