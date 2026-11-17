import { z, ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { couponSchema, validateCouponSchema } from "@/lib/validations/coupon.schema";
import { reviewSchema, reviewUpdateSchema } from "@/lib/validations/review.schema";
import { contactSchema, contactUpdateSchema } from "@/lib/validations/contact.schema";
import { couponService } from "@/services/coupon.service";
import { orderService } from "@/services/order.service";
import { userRepository } from "@/repositories/user.repository";
const bannerSchema = z.object({
  title: z.string().trim().min(1).max(160),
  subtitle: z.string().trim().max(300).optional().or(z.literal("")),
  imageUrl: z.string().url(),
  publicId: z.string().trim().min(1).max(300),
  buttonText: z.string().trim().max(80).optional().or(z.literal("")),
  buttonLink: z.string().trim().max(500).optional().or(z.literal("")),
  isActive: z.boolean().default(true)
}).strict();

export const adminController = {
  dashboard() {
    return orderService.stats();
  },

  listCoupons() {
    return couponService.list();
  },

  async createCoupon(payload: any) {
    try {
      const data = couponSchema.parse(payload);
      return await couponService.create({ ...data, expiryDate: new Date(data.expiryDate) });
    } catch (error) {
      if (error instanceof ZodError) throw new Error(JSON.stringify(error.flatten().fieldErrors));
      throw error;
    }
  },

  async updateCoupon(id: string, payload: any) {
    try {
      const data = couponSchema.partial().parse(payload);
      return await couponService.update(id, {
        ...data,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined
      });
    } catch (error) {
      if (error instanceof ZodError) throw new Error(JSON.stringify(error.flatten().fieldErrors));
      throw error;
    }
  },

  deleteCoupon(id: string) {
    return couponService.remove(id);
  },

  async validateCoupon(payload: any) {
    try {
      const data = validateCouponSchema.parse(payload);
      return await couponService.validate(data.code, data.amount);
    } catch (error) {
      if (error instanceof ZodError) throw new Error(JSON.stringify(error.flatten().fieldErrors));
      throw error;
    }
  },

  listBanners() {
    return prisma.banner.findMany({ orderBy: { createdAt: "desc" } });
  },

  createBanner(payload: any) {
    return prisma.banner.create({ data: bannerSchema.parse(payload) });
  },

  updateBanner(id: string, payload: any) {
    return prisma.banner.update({ where: { id }, data: bannerSchema.partial().parse(payload) });
  },

  deleteBanner(id: string) {
    return prisma.banner.delete({ where: { id } });
  },

  listReviews() {
    return prisma.review.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" }
    });
  },

  updateReview(id: string, payload: any) {
    return prisma.review.update({ where: { id }, data: reviewUpdateSchema.parse(payload) });
  },

  deleteReview(id: string) {
    return prisma.review.delete({ where: { id } });
  },

  listContactQueries() {
    return prisma.contactQuery.findMany({ orderBy: { createdAt: "desc" } });
  },

  updateContactQuery(id: string, payload: any) {
    return prisma.contactQuery.update({ where: { id }, data: contactUpdateSchema.parse(payload) });
  },

  listCustomers() {
    return userRepository.listCustomers();
  },

  async createReview(payload: any, userId?: string) {
    try {
      const data = reviewSchema.parse(payload);
      return await prisma.review.create({
        data: {
          ...data,
          userId,
          isApproved: false
        }
      });
    } catch (error) {
      if (error instanceof ZodError) throw new Error(JSON.stringify(error.flatten().fieldErrors));
      throw error;
    }
  },

  async createContactQuery(payload: any) {
    try {
      const data = contactSchema.parse(payload);
      return await prisma.contactQuery.create({
        data: {
          ...data,
          email: data.email || null
        }
      });
    } catch (error) {
      if (error instanceof ZodError) throw new Error(JSON.stringify(error.flatten().fieldErrors));
      throw error;
    }
  }
};
