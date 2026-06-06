import { User, Role } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { comparePassword } from "../../utils/hash";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";

 
const userLogin = async (
  payload: Pick<User, "email" | "password">,
  reqSubdomain?: string,
  reqVendorId?: number,
) => {
  // ১. ইউজার খুঁজে বের করা (সাথে রিলেটেড প্রোফাইল সহ)
  const user = await prisma.user.findFirst({
    where: { email: payload.email },
    include: {
      vendorProfile: true, // আপনার স্কিমার রিলেশন অনুযায়ী নাম দিবেন
      customerProfile: true,
    },
  });

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "ভুল ইমেইল বা পাসওয়ার্ড");
  }

  // ২. পাসওয়ার্ড চেক
  const isMatchedPassword = await comparePassword(
    payload.password,
    user.password,
  );
  if (!isMatchedPassword) {
    throw new AppError(StatusCodes.BAD_REQUEST, "ভুল ইমেইল বা পাসওয়ার্ড");
  }

  // ==========================================
  // ৩. রোল ও সাবডোমেইন ভিত্তিক সিকিউরিটি ফিল্টার
  // ==========================================

  // কাস্টমারদের জন্য চেক
  if (user.role === Role.CUSTOMER) {
    if (!reqVendorId) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "কাস্টমার শুধুমাত্র ভেন্ডর শপ সাইট থেকে লগইন করতে পারবেন।",
      );
    }

    // কাস্টমার এই নির্দিষ্ট ভেন্ডরের আন্ডারে আছে কিনা ভ্যালিডেশন
    if (user.customerProfile?.vendorId !== String(reqVendorId)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "এই শপে আপনার কোনো অ্যাকাউন্ট নেই।",
      );
    }
  }

  // এডমিনের জন্য চেক (শুধুমাত্র admin সাবডোমেনে লগইন করতে পারবে)
  if (user.role === Role.ADMIN && reqSubdomain !== "admin") {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "এডমিন শুধুমাত্র এডমিন পোর্টাল থেকে লগইন করতে পারবেন।",
    );
  }

  // ভেন্ডরের জন্য চেক (যদি অন্য কোনো ভেন্ডরের সাবডোমেন থেকে লগইন করার চেষ্টা করে)
  if (
    user.role === Role.VENDOR &&
    reqVendorId &&
    user.vendorProfile?.id !== String(reqVendorId)
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "আপনি অন্য কোনো ভেন্ডরের সাইট থেকে লগইন করতে পারবেন না।",
    );
  }

  return user;
};

export const authServices = {
  userLogin,
};
