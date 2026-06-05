import { Request, Response } from "express";
import { catchAsync } from "../../middleware/errorHandler";
import { vendorServices } from "./vendor.service";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const createVendorReq = catchAsync(async (req: Request, res: Response) => {
    const result = await vendorServices.createVendor(req.body);
    
    sendResponse(res, StatusCodes.CREATED, 'Vendor Register SuccessFul!', result);
});

export const vendorController = {
    createVendorReq
}