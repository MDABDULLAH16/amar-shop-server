import { Role, User, VendorProfile } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../utils/hash";
import { AppError } from "./../../utils/appError";
import { StatusCodes } from "http-status-codes";

const createVendor = async (payload: any) => {
  const hashedPassword = await hashPassword(payload.password);
  const isExist = await prisma.vendorProfile.findUnique({
    where: {
      subdomain: payload.subdomain,
    },
  });

  if (isExist) {
    throw new AppError(StatusCodes.CONFLICT, "This subdomain already exist");
    }
    const existUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (existUser) {
      throw new AppError(StatusCodes.CONFLICT, "you have already user account");
    }
  return await prisma.$transaction(async (tnx) => {
    
    const user = await tnx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: payload.name,
        role: Role.VENDOR,
      },
    });
    const vendor = await tnx.vendorProfile.create({
      data: {
        subdomain: payload.subdomain,
        shopSlug: payload.shopSlug,
        userId: user.id,
      },
    });
    return { user, vendor };
  });
};

export const vendorServices = {
  createVendor,
};
