import { User } from "@prisma/client";
import { catchAsync } from "../../middleware/errorHandler";
import { prisma } from "../../lib/prisma";
import { hashPassword } from "../../utils/hash";

const userRegister = catchAsync(async (payload: User) => {
  const hashedPassword = await hashPassword(payload.password);
  const user = await prisma.user.create({
    data: {
      email: payload.email,
      password: hashedPassword,
      name: payload.name,
    },
  });
  return user;
});

export const userServices = {
  userRegister,
};
