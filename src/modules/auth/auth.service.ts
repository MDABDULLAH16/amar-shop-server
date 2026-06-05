import { User } from "@prisma/client";
import { catchAsync } from "../../middleware/errorHandler";
import { prisma } from "../../lib/prisma";
import { comparePassword, hashPassword } from "../../utils/hash";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";

const userLogin = async (payload: User) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { email: payload.email },
  });
  const isMatchedPassword = await comparePassword(
    payload.password,
    user.password,
  );
  if (!isMatchedPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "invalid User or Password");
  }
  return user;
};

export const authServices = {
  userLogin,
};
