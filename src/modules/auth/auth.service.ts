import { User, Role } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { comparePassword } from "../../utils/hash";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";

const userLogin = async (
  payload: Pick<User, "email" | "password">,
  reqSubdomain?: string,
) => {
  const subdomain = reqSubdomain;

  // 1. find user
  const user = await prisma.user.findFirst({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // 2.check password
  const isMatchedPassword = await comparePassword(
    payload.password,
    user.password,
  );
  if (!isMatchedPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "password don't match");
  }
  if (user.role === Role.CUSTOMER) {
    if (!subdomain) {
      throw new AppError(StatusCodes.NOT_FOUND, "YOur shop not found");
    }

    const checkShop = await prisma.vendorProfile.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    if (!checkShop?.id) {
      throw new AppError(StatusCodes.NOT_FOUND, "shop not found for this user");
    }
  }
  if (user.role === Role.ADMIN) {
    if (subdomain) {
      throw new AppError(StatusCodes.CONFLICT, "You only access main domain");
    }
    const checkVerifyAdmin = await prisma.adminProfile.findUnique({
      where: {
        email: user.email,
      },
      select: {
        isVerified: true,
      },
    });
    if (!checkVerifyAdmin?.isVerified) {
      throw new AppError(
        StatusCodes.UNAUTHORIZED,
        "You are not verified yet! please waiting for verify.",
      );
    }
  }
  if (user.role === Role.VENDOR) {
    if (subdomain) {
      console.log("sub domain", subdomain);
      throw new AppError(StatusCodes.CONFLICT, "vendor can access main domain");
    }
  }

  return user;
};

export const authServices = {
  userLogin,
};
