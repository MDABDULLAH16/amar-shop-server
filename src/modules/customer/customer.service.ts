import { CustomerProfile, Role, User } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../utils/hash";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";

const createCustomer = async (payload: any) => {
  const hashedPassword = await hashPassword(payload.password);
 const isExist= await prisma.user.findUnique({
    where: { email: payload.email },
 });
    if (isExist) {
        throw new AppError(StatusCodes.CONFLICT,'you have already account,please login')
    }
  return await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        role: Role.CUSTOMER,
        name: payload.name,
      },
    });
    const customer = await tnx.customerProfile.create({
      data: {
        userId: user.id,
        vendorId: payload.vendorId,
      },
    });
    return { user, customer };
  });
};

export const customerServices = {
  createCustomer,
};
