import { Request } from "express";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { getVendorId } from "../../shared/getVendorId";

const productAdd = async (req: Request) => {
  const userId = req.user.userId;
  const vendorId = await getVendorId(userId);
  // if (!vendorId) {
  //   throw new AppError(StatusCodes.NOT_FOUND,'vendor id not found')
  // }
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
const getAllProductForVendor = async (req: Request) => {
  const userId = req.user.userId;
  const vendorId = await getVendorId(userId);

  // 1. Extract query parameters with sensible defaults
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = req.query.search as string;
  const status = req.query.status as string; // e.g., 'ACTIVE', 'DRAFT'

  // 2. Build dynamic filters
  const whereConditions: any = {
    vendorId,
    isDeleted: false,
  };

  if (search) {
    whereConditions.name = {
      contains: search,
      mode: "insensitive", // Case-insensitive search
    };
  }

  if (status) {
    whereConditions.status = status;
  }

  // 3. Execute query with pagination and sorting
  const [products, totalCount] = await prisma.$transaction([
    prisma.product.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc", // Newest products first
      },
    }),
    prisma.product.count({ where: whereConditions }),
  ]);

  // 4. Return data along with meta-data for the frontend
  return {
    meta: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
    data: products,
  };
};
const getSingleProductFromDB = async (productId: string) => {
     
  const product = await prisma.product.findUnique({
    where: {
       id: productId,
    },
     
  });

  // Security check: Don't return the product if it was soft-deleted
  if (!product || product.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND,'product not found')
  }

  return product;
};
export const productServices = {
  productAdd,
  getAllProductForVendor,
  getSingleProductFromDB
};
