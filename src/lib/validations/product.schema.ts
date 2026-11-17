import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  sku: z.string().trim().min(2).max(64),
  categoryId: z.string().min(1),
  shortDescription: z.string().min(10).max(500),
  description: z.string().min(20).max(10000),
  highlights: z.array(z.string().max(300)).max(30).default([]),
  specifications: z.record(z.string().max(100), z.string().max(1000)).default({}),
  mrp: z.number().positive(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z.array(z.object({ imageUrl: z.string().url(), publicId: z.string().min(1).max(300) }).strict()).min(1).max(20)
}).strict();

export type ProductInput = z.infer<typeof productSchema>;
