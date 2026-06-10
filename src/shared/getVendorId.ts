import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/appError";
import { prisma } from "../lib/prisma";

export const getVendorId = async (userId:string) => {
       

      const vendorAccount = await prisma.vendorProfile.findUnique({
        where: {
          userId: userId,
        },
      });

      //check vendor domain;
      if (!vendorAccount) {
        throw new AppError(StatusCodes.NOT_FOUND, "vendor account not found");
      }
    const vendorId = vendorAccount.id;
    return vendorId
}