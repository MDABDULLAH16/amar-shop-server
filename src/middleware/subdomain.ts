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
    const host = req.get("host");
    // console.log('hostss',host);
    console.log(req.subdomain);

    if (!host) {
      throw new AppError(StatusCodes.FORBIDDEN, "invalid host");
    }

    const parts = host.split(".");
    // console.log('pp',parts);

    // লোকালহোস্ট বা মেইন ডোমেইনের জন্য কন্ডিশন (ধরি ৩ লেভেলের কম হলে মেইন সাইট)
    // if (parts.length < 3 || host.includes("www")) {
    //   return next(); // মেইন ল্যান্ডিং পেজ বা সেন্ট্রাল অ্যাডমিনের জন্য
    // }

    const subdomain = parts[0].toLowerCase();
    // console.log('sub',subdomain);

    // ডাটাবেজ থেকে সাবডোমেইনের ভেন্ডর খুঁজে বের করা
    const vendor = await prisma.vendorProfile.findUnique({
      where: { subdomain },
    });
    // console.log('vendor',vendor);

    // || !vendor.isApproved
    if (!vendor) {
      throw new AppError(StatusCodes.NOT_FOUND, "shop not found or inActive");
    }

    // ভেন্ডর আইডি রিকোয়েস্টে সেট করা হচ্ছে
    req.vendorId = vendor.id;
    req.subdomain = vendor.subdomain;
    next();
  } catch (error) {
    res.status(500).json({ error: "Subdomain resolution failed" });
  }
};
