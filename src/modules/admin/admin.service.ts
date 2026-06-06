import { Role,  } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../utils/hash";
import { AppError } from "./../../utils/appError";
import { StatusCodes } from "http-status-codes";

const createAdmin = async (payload: any) => {
  const hashedPassword = await hashPassword(payload.password);
  const isExist = await prisma.adminProfile.findUnique({
    where: {
      email: payload.email,
    },
  });
    if (isExist) {
        throw new AppError(StatusCodes.CONFLICT,'You are already ADMIN')
    }
  return await prisma.$transaction(async (tnx) => {
    const user = await tnx.user.create({
      data: {
        email: payload.email,
        password: hashedPassword,
        name: payload.name,
        role: Role.ADMIN,
      },
    });
    const admin = await tnx.adminProfile.create({
      data: {
        email:user.email,
        userId: user.id,
      },
    });
    return { user, admin };
  });
};

export const adminServices = {
  createAdmin,
};
