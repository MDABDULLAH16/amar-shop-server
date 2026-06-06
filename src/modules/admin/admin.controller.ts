import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../middleware/errorHandler";

import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { adminServices } from "./admin.service";
import { AppError } from "../../utils/appError";

const createAdminReq = catchAsync(async (req: Request, res: Response,next:NextFunction) => {
    if (req.subdomain !== "main" && req.subdomain !== "www") {
      return next(
        new AppError(
          StatusCodes.BAD_REQUEST,
          "Admin or Vendor registration is only allowed on the main website.",
        ),
      );
    }
  const result = await adminServices.createAdmin(req.body);

  sendResponse(res, StatusCodes.CREATED, "Admin Register SuccessFul!", result);
});

export const adminController = {
  createAdminReq,
};
