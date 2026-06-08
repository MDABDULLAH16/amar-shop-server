import { Router } from "express";
import { authController } from "./auth.controller";
import { subdomainMiddleware } from "./../../middleware/subdomain";
import { Request } from "express";
import { Response } from "express";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const router = Router();
// router.post('/admin/login', authController.loginVendorAndAdminReq);
router.post("/login", authController.loginUserReq);
router.post('/logout', (req:Request,res:Response) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: 'lax',
    });
    return sendResponse(res,StatusCodes.OK,'User logout successful')
})



export const authRoutes = router;
