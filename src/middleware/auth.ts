import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
 

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "token not provided");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    // Confirm the user still exists in DB
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) throw new AppError(StatusCodes.UNAUTHORIZED, "User not Exist");

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

export const authorizeRoles =
  (...roles: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You do not have permission to perform this action",
      );
    }
    next();
  };
