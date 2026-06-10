import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";

export const subdomainMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const host = req.hostname.toLowerCase();
  console.log("hostt", host);

  // localhost => main domain
  if (host === "localhost") {
    return next();
  }

  const parts = host.split(".");

  /**
   * Examples:
   *
   * amarshop.com
   * => ["amarshop", "com"]
   *
   * www.amarshop.com
   * => ["www", "amarshop", "com"]
   *
   * vendor1.amarshop.com
   * => ["vendor1", "amarshop", "com"]
   */

  // // amarshop.com
  // if (parts.length === 2) {
  //   console.log('parts lentch',parts.length);

  //   return next();
  // }

  const subdomain = parts[0];

  // www.amarshop.com => treat as main domain
  if (subdomain === "www") {
    console.log("sub www", subdomain);
    return next();
  }
  const vendorPrfile = await prisma.vendorProfile.findUnique({
    where: {
      subdomain: subdomain,
    },
  });
  if (!vendorPrfile?.subdomain) {
    throw new AppError(StatusCodes.NOT_FOUND, "Store not found");
  }

  req.subdomain = subdomain;
  req.vendorId = vendorPrfile.id;

  next();
};
