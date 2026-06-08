import { Request, Response } from "express";
import { catchAsync } from "../../middleware/errorHandler";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { signToken } from "../../utils/jwt";
import { tr } from "zod/locales";

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

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 24,
  });

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
