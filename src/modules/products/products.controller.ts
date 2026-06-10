import { Request, Response } from "express";
import { catchAsync } from "../../middleware/errorHandler";
import { productServices } from "./products.service";
import { sendResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const productAddReq = catchAsync(async (req: Request, res: Response) => {
  const result = await productServices.productAdd(req);
  sendResponse(res, StatusCodes.CREATED, "New Product Added", result);
});
const getAllProductForVendorReq = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productServices.getAllProductForVendor(req);
    sendResponse(
      res,
      StatusCodes.OK,
      "Fetch Product for single vendor",
      result,
    );
  },
);
const getSingleProductFromDBReq = catchAsync(
  async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    const result = await productServices.getSingleProductFromDB(productId);
    sendResponse(res, StatusCodes.OK, "Fetch single product", result);
  },
);
export const productController = {
  productAddReq,
  getAllProductForVendorReq,
  getSingleProductFromDBReq,
};
