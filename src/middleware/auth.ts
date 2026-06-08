import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import { catchAsync } from "./errorHandler";

export const authenticate = catchAsync(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.split(' ')[1];
    const cookieToken = req.cookies?.accessToken;
    console.log('co',cookieToken);
    
    const token = headerToken || cookieToken;
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "unauthorized User");
    }
    const payload = verifyToken(token);
    if (!payload) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid User");
    }

    req.user = payload;
    next();
  },
);

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
