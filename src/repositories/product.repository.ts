import { prisma } from "@/lib/prisma";
import { ProductFilters } from "@/types";

export const productRepository = {
  async list(filters: ProductFilters = {}) {
    const where: Record<string, unknown> = {
      isActive: true
    };

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { shortDescription: { contains: filters.search, mode: "insensitive" } }
      ];
    }
    if (filters.category) {
      where.category = { slug: filters.category };
    }
    if (typeof filters.minPrice === "number" || typeof filters.maxPrice === "number") {
      where.price = {
        gte: filters.minPrice,
        lte: filters.maxPrice
      };
    }
    if (filters.featured) where.isFeatured = true;
    if (filters.bestSeller) where.isBestSeller = true;

    const orderBy: any =
      filters.sort === "price_asc"
        ? { price: "asc" }
        : filters.sort === "price_desc"
          ? { price: "desc" }
          : { createdAt: "desc" };

    return prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } }
      }
    });
  },

  async listAdmin() {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true
      }
    });
  },

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true
      }
    });
  },

  async create(data: any) {
    return prisma.product.create({
      data: {
        ...data,
        discountPercent: Math.max(0, Math.round(((Number(data.mrp) - Number(data.price)) / Number(data.mrp)) * 100)),
        images: {
          create: data.images
        }
      },
      include: { images: true, category: true }
    });
  },

  async update(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data: {
        ...data,
        discountPercent: Math.max(0, Math.round(((Number(data.mrp) - Number(data.price)) / Number(data.mrp)) * 100)),
        images: data.images
          ? {
              deleteMany: {},
              create: data.images
            }
          : undefined
      },
      include: { images: true, category: true }
    });
  },

  async remove(id: string) {
    return prisma.product.delete({ where: { id } });
  },

  async related(categoryId: string, productId: string) {
    return prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        isActive: true
      },
      take: 4,
      include: { images: true }
    });
  }
};
