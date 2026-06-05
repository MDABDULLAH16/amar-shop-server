import { Request, Response } from "express";
import { catchAsync } from "../../middleware/errorHandler";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const loginUserReq = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.userLogin(req.body);
  sendResponse(res, StatusCodes.OK, "User Login Successful!!");
});

export const authController = {
  loginUserReq,
};
