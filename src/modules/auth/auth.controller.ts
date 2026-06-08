import { Request, Response } from "express";
import { catchAsync } from "../../middleware/errorHandler";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { signToken } from "../../utils/jwt";
import { env } from "../../config/env";

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

  const isProduction = env.NODE_ENV === "production";
  const productionDomain = env.DOMAIN; // e.g., ".amarshop.com"

  // ১. কমন কুকি অপশন (কোড ক্লিন রাখার জন্য)
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    domain: isProduction ? productionDomain : ".localhost",
  };

  // ২. set accessToken cookie (মেয়াদ: ১ দিন)
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24,
  });

  // ৩. set refreshToken cookie (মেয়াদ: ৭ দিন এবং ডোমেন ফিক্সড)
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  // dynamic success message
  sendResponse(res, StatusCodes.OK, `${result.role} Login Successful!!`, {
    user: {
      name: result.name,
      role: result.role,
      email: result.email,
    },
    accessToken,
  });
});

export const authController = {
  loginUserReq,
};
