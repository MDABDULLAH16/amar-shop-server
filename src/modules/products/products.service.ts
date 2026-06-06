import { Request } from "express";
import { prisma } from "../../lib/prisma";

const productAdd = async (req: Request) => {
    console.log('vv',req.vendorId);
    
  const vendorId = req.vendorId;

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
