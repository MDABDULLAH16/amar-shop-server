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
  const mainDomain = env.DOMAIN;
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

  // ==========================================
  // 3. role and subdomain check
  // ==========================================

  // customer
  if (user.role === Role.CUSTOMER) {
    if (!reqSubdomain) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Customers can only log in through a vendor subdomain.",
      );
    }
    //check store and which vendor under your registration
    const vendorShop = await prisma.vendorProfile.findUnique({
      where: {
        subdomain: reqSubdomain,
      },
      select: {
        isApproved: true,
      },
    });
    console.log("approved", vendorShop);

    if (!vendorShop?.isApproved) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "This store does not approved now",
      );
    }
  }

  if ( user.role === Role.VENDOR) {
    const checkDomain = reqSubdomain !== mainDomain;
    if (checkDomain) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You will be login with main domain only",
      );
    }
  }
  if (user.role === Role.ADMIN) {
    const checkDomain = reqSubdomain !== mainDomain;
    if (checkDomain) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You will be login with main domain only",
      );
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

  return user;
};

export const authServices = {
  userLogin,
};
