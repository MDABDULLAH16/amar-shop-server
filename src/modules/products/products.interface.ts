interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  vendorId: string;
  images: { url: string; isFeatured: boolean }[];
}
