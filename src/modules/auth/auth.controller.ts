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

// একটি মাত্র ফাংশন যা সব রোল হ্যান্ডেল করবে
const loginUserReq = catchAsync(async (req: Request, res: Response) => {
  // মিডলওয়্যার থেকে পাওয়া subdomain এবং vendorId সার্ভিসে পাস করা হচ্ছে
  const result = await authServices.userLogin(
    req.body,
    req.subdomain,
    req.vendorId as any,
  );

  const payload = {
    userId: result.id,
    role: result.role,
    email: result.email,
  };

  // টোকেন জেনারেশন
  const accessToken = signToken(payload);
  const refreshToken = signToken(payload);

  // কুকি সেট করা
  res.cookie("accessToken", accessToken, getCookieOptions(1000 * 60 * 60 * 24));
  res.cookie(
    "refreshToken",
    refreshToken,
    getCookieOptions(1000 * 60 * 60 * 24 * 90),
  );

  // ডাইনামিক সাকসেস মেসেজ ও ডেটা রেসপন্স
  sendResponse(res, StatusCodes.OK, `${result.role} Login Successful!!`, {
    user: {
      id: result.id,
      name: result.name,
      role: result.role,
      email: result.email,
    },
  });
});

export const authController = {
  loginUserReq,
};
