import { Request, Response } from "express";
import { catchAsync } from "../../middleware/errorHandler";
import { customerServices } from "./customer.service";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const createCustomerReq = catchAsync(async (req: Request, res: Response) => {
  const result = await customerServices.createCustomer(req.body);
  sendResponse(
    res,
    StatusCodes.CREATED,
    "Customer Register SuccessFul!",
    result,
  );
});


export const customerController = {
    createCustomerReq
}