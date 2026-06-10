import { z } from "zod";

const productImageSchema = z.object({
  url: z.string().url({
    message: "Image URL must be a valid URL.",
  }),

  isFeatured: z.boolean({
    message: "isFeatured must be a boolean value.",
  }),
});

export const createProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, {
        message: "Product name must be at least 3 characters long.",
      })
      .max(100, {
        message: "Product name cannot exceed 100 characters.",
      }),

    description: z
      .string()
      .trim()
      .min(10, {
        message: "Description must be at least 10 characters long.",
      })
      .max(1000, {
        message: "Description cannot exceed 1000 characters.",
      }),

    price: z
      .number({
        message: "Price must be a number.",
      })
      .positive({
        message: "Price must be greater than 0.",
      }),

    stock: z
      .number({
        message: "Stock must be a number.",
      })
      .int({
        message: "Stock must be an integer.",
      })
      .min(0, {
        message: "Stock cannot be negative.",
      }),

    images: z.array(productImageSchema).min(1, {
      message: "At least one product image is required.",
    }),
  })
  .superRefine((data, ctx) => {
    const featuredImages = data.images.filter((image) => image.isFeatured);

    if (featuredImages.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["images"],
        message: "One featured image is required.",
      });
    }

    if (featuredImages.length > 1) {
      ctx.addIssue({
        code: "custom",
        path: ["images"],
        message: "Only one image can be marked as featured.",
      });
    }
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;
