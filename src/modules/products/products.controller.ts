import { Request, Response } from "express";
import { catchAsync } from "../../middleware/errorHandler";
import { productServices } from "./products.service";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const productAddReq = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.productAdd(req);
    sendResponse(res,StatusCodes.CREATED,'New Product Added',result)
});

export const productController = {
    productAddReq
}