import { Request, Response, NextFunction } from "express";

import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import { catchAsync } from "./errorHandler";

export const subdomainMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const host = req.get("host"); // e.g., "vendor1.localhost:3000" or "vendor.amarshop.com"
    // console.log("host", host);

    if (!host) {
      return next(new AppError(StatusCodes.BAD_REQUEST, "Invalid host"));
    }

    const parts = host.split(".");
    const subDomain = parts[0];

     

    req.subdomain = subDomain;
    
    return next();
  } catch (error) {
    next(
      new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Subdomain resolution failed",
      ),
    );
  }
}
