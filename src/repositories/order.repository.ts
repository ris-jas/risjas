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

  async reserveStockForOrder(orderId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });
      if (!order) {
        throw new Error("Order not found");
      }

      const reservationReason = `ORDER:${orderId}:RESERVED`;
      const alreadyReserved = await tx.inventoryLog.count({
        where: {
          reason: reservationReason
        }
      });

      if (alreadyReserved > 0) {
        return { reserved: true, alreadyReserved: true };
      }

      for (const item of order.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          select: { id: true, stock: true, name: true, isActive: true }
        });

        if (!product || !product.isActive) {
          throw new Error(`${item.productName} is unavailable`);
        }

        if (Number(product.stock) < item.quantity) {
          throw new Error(`${item.productName} has insufficient stock`);
        }
      }

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });

        await tx.inventoryLog.create({
          data: {
            productId: item.productId,
            change: -item.quantity,
            reason: reservationReason
          }
        });
      }

      return { reserved: true, alreadyReserved: false };
    });
  },

  async stats() {
    const [orders, delivered, cancelled, pending, products, lowStockProducts, topOrderItems, recentOrders] = await Promise.all([
      prisma.order.findMany(),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true, stock: { lte: 10 } } }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: {
          _sum: {
            quantity: "desc"
          }
        },
        take: 5
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { items: true }
      })
    ]);

    const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter((o) => o.createdAt >= today).length;

    const topProductIds = topOrderItems.map((item) => item.productId);
    const topProducts = topProductIds.length
      ? await prisma.product.findMany({
          where: { id: { in: topProductIds } },
          include: { images: true }
        })
      : [];
    const topProductMap = new Map(topProducts.map((product) => [product.id, product]));
    const bestSellingProducts = topOrderItems
      .map((item) => {
        const product = topProductMap.get(item.productId);
        if (!product) return null;
        return {
          ...product,
          soldQty: Number(item._sum.quantity || 0)
        };
      })
      .filter(Boolean);

    return {
      totalRevenue,
      totalOrders: orders.length,
      todayOrders,
      pendingOrders: pending,
      deliveredOrders: delivered,
      cancelledOrders: cancelled,
      totalProducts: products,
      lowStockProducts,
      bestSellingProducts,
      recentOrders
    };
  }
};
