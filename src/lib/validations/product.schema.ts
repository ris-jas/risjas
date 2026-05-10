import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  categoryId: z.string().min(1),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  highlights: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).default({}),
  mrp: z.number().positive(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z.array(z.object({ imageUrl: z.string().url(), publicId: z.string().min(1) })).min(1)
});

export type ProductInput = z.infer<typeof productSchema>;
