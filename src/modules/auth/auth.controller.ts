import { Request, Response } from "express";
import { catchAsync } from "../../middleware/errorHandler";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { signToken } from "../../utils/jwt";

const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // প্রোডাকশনে সব সাবডোমেনে কুকি শেয়ার করার জন্য মেইন ডোমেন (যেমন: '.amarshop.com')
  ...(process.env.NODE_ENV === "production" && { domain: ".yourdomain.com" }),
  maxAge,
});

// multiple login (VENDOR,CUSTOMER,ADMIN);
const loginUserReq = catchAsync(async (req: Request, res: Response) => {
   
  const result = await authServices.userLogin(req.body, req.subdomain);

  const payload = {
    userId: result.id,
    role: result.role,
    email: result.email,
  };

  // token generation
  const accessToken = signToken(payload);
  const refreshToken = signToken(payload);

  // set cookie
  res.cookie("accessToken", accessToken, getCookieOptions(1000 * 60 * 60 * 24));
  res.cookie(
    "refreshToken",
    refreshToken,
    getCookieOptions(1000 * 60 * 60 * 24 * 90),
  );

  // dynamic success message
  sendResponse(res, StatusCodes.OK, `${result.role} Login Successful!!`, {
    user: {
      name: result.name,
      role: result.role,
      email: result.email,
    },
  });
});

export const authController = {
  loginUserReq,
};
