import { prisma } from "@/lib/prisma";

export const couponRepository = {
  list() {
    return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  },

  findByCode(code: string) {
    return prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
  },

  create(data: any) {
    return prisma.coupon.create({ data });
  },

  update(id: string, data: any) {
    return prisma.coupon.update({ where: { id }, data });
  },

  remove(id: string) {
    return prisma.coupon.delete({ where: { id } });
  }
};