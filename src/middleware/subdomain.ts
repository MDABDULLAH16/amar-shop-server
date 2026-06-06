import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";

export const subdomainMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const host = req.get("host"); // e.g., "vendor1.localhost:3000" or "admin.amarshop.com"
    if (!host) {
      return next(new AppError(StatusCodes.BAD_REQUEST, "Invalid host"));
    }

    const parts = host.split(".");

    // ১. লোকালহোস্ট এবং প্রোডাকশন ডোমেন আলাদা করা
    const isLocalhost = host.includes("localhost");

    // সাবডোমেন ডিটেক্ট করার কন্ডিশন
    // লোকালহোস্টে parts.length > 1 মানেই সাবডোমেন আছে (e.g., shop1.localhost:3000)
    // রিয়াল ডোমেনে parts.length > 2 মানে সাবডোমেন আছে (e.g., shop1.amarshop.com)
    const hasSubdomain = isLocalhost ? parts.length > 1 : parts.length > 2;

    if (!hasSubdomain) {
      // এটি মেইন ল্যান্ডিং পেজ (যেমন: localhost:3000 বা amarshop.com)
      req.subdomain = "main";
      return next();
    }

    const subdomain = parts[0].toLowerCase();

    // ২. এডমিন প্যানেলের জন্য স্পেশাল চেক
    if (subdomain === "admin" || subdomain === "www") {
      req.subdomain = subdomain;
      return next(); // এডমিন বা www হলে ভেন্ডর চেক করার দরকার নেই
    }

    // ৩. ভেন্ডর সাবডোমেন হলে ডাটাবেজ চেক
    const vendor = await prisma.vendorProfile.findUnique({
      where: { subdomain },
    });

    if (!vendor) {
      return next(
        new AppError(StatusCodes.NOT_FOUND, "Shop not found or inactive"),
      );
    }

    // রিকোয়েস্টে ডেটা সেট করা
    req.vendorId = vendor.id;
    req.subdomain = vendor.subdomain;

    next();
  } catch (error) {
    next(
      new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Subdomain resolution failed",
      ),
    );
  }
};
