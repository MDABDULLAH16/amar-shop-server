import { Router } from "express";
import { productController } from "./products.controller";
import { authenticate, authorizeRoles } from "../../middleware/auth";
import { Role } from "@prisma/client";
import { validateSchema } from './../../middleware/validation';
import { createProductSchema } from "./products.validation";
import { productServices } from "./products.service";

const router = Router()
router.get(
  "/get-single-product/:productId",
  productController.getSingleProductFromDBReq,
);
router.use(authenticate);
router.use(authorizeRoles(Role.VENDOR));
router.post("/product-add", validateSchema(createProductSchema), productController.productAddReq);
router.get('/get-all-products-for-vendor', productController.getAllProductForVendorReq);


export const productRoutes = router;
