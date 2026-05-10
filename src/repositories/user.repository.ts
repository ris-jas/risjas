import { prisma } from "@/lib/prisma";

export const userRepository = {
  listCustomers() {
    return prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" }
    });
  }
};
