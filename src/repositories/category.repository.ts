import { unstable_cache, revalidateTag } from "next/cache";

import { prisma } from "@/lib/prisma";

const getCachedActiveCategories = unstable_cache(
  () => prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  }),
  ["categories-active"],
  { revalidate: 300, tags: ["categories"] }
);

export const categoryRepository = {
  listActive() {
    return getCachedActiveCategories();
  },
  listAdmin() {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" }
    });
  },
  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },
  async create(data: any) {
    const category = await prisma.category.create({ data });
    revalidateTag("categories");
    return category;
  },
  async update(id: string, data: any) {
    const category = await prisma.category.update({ where: { id }, data });
    revalidateTag("categories");
    return category;
  },
  async remove(id: string) {
    const category = await prisma.category.delete({ where: { id } });
    revalidateTag("categories");
    return category;
  }
};
