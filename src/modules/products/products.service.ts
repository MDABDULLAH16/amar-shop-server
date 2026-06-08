import { Request } from "express";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";

const productAdd = async (req: Request) => {
  const userId = req.user.userId;
  const vendorAccount = await prisma.vendorProfile.findUnique({
    where: {
      userId: userId,
    },
  });
  if (!vendorAccount) {
    throw new AppError(StatusCodes.NOT_FOUND, "vendor account not found");
  }
  const vendorId = vendorAccount?.id;

  const payload = req.body;
  const { name, description, price, stock, images } = payload;
  const newProduct = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stock,
      vendorId,
      images: {
        createMany: {
          data: images,
        },
      },
    },
    include: {
      images: true,
    },
  });
  return newProduct;
};

export const productServices = {
  productAdd,
};
