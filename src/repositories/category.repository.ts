import { prisma } from "@/lib/prisma";

export const categoryRepository = {
  listActive() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" }
    });
  },
  listAdmin() {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" }
    });
  },
  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },
  create(data: any) {
    return prisma.category.create({ data });
  },
  update(id: string, data: any) {
    return prisma.category.update({ where: { id }, data });
  },
  remove(id: string) {
    return prisma.category.delete({ where: { id } });
  }
};
