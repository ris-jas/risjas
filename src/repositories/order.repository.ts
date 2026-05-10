import { OrderStatus, PaymentStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const orderRepository = {
  create(data: Prisma.OrderCreateInput) {
    return prisma.order.create({
      data,
      include: {
        items: true,
        payment: true
      }
    });
  },

  findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payment: true
      }
    });
  },

  findByOrderNumber(orderNumber: string, phone: string) {
    return prisma.order.findFirst({
      where: { orderNumber, phone },
      include: { items: true, payment: true }
    });
  },

  listAdmin(query?: { search?: string; status?: OrderStatus }) {
    return prisma.order.findMany({
      where: {
        status: query?.status,
        OR: query?.search
          ? [
              { orderNumber: { contains: query.search, mode: "insensitive" } },
              { customerName: { contains: query.search, mode: "insensitive" } },
              { phone: { contains: query.search, mode: "insensitive" } }
            ]
          : undefined
      },
      orderBy: { createdAt: "desc" },
      include: { items: true, payment: true }
    });
  },

  updateStatus(id: string, status: OrderStatus) {
    return prisma.order.update({ where: { id }, data: { status } });
  },

  updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
    return prisma.order.update({ where: { id }, data: { paymentStatus } });
  },

  async stats() {
    const [orders, delivered, cancelled, pending, products] = await Promise.all([
      prisma.order.findMany(),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count()
    ]);

    const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => o.createdAt >= today).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      todayOrders,
      pendingOrders: pending,
      deliveredOrders: delivered,
      cancelledOrders: cancelled,
      totalProducts: products,
      lowStockProducts: await prisma.product.count({ where: { stock: { lt: 10 } } }),
      bestSellingProducts: await prisma.product.findMany({
        where: { isBestSeller: true },
        take: 5,
        include: { images: true }
      }),
      recentOrders: await prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { items: true }
      })
    };
  }
};
