import { DiscountType } from "@prisma/client";
import { couponRepository } from "@/repositories/coupon.repository";

export const couponService = {
  list() {
    return couponRepository.list();
  },

  async validate(code: string, amount: number) {
    const coupon = await couponRepository.findByCode(code);

    if (!coupon || !coupon.isActive) {
      throw new Error("Invalid coupon");
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      throw new Error("Coupon expired");
    }

    if (amount < Number(coupon.minOrderAmount)) {
      throw new Error(`Minimum order amount is ${coupon.minOrderAmount}`);
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit reached");
    }

    const discount =
      coupon.discountType === DiscountType.PERCENTAGE
        ? (amount * Number(coupon.discountValue)) / 100
        : Number(coupon.discountValue);

    return {
      coupon,
      discount: Math.min(amount, discount)
    };
  },

  create(data: any) {
    return couponRepository.create(data);
  },

  update(id: string, data: any) {
    return couponRepository.update(id, data);
  },

  remove(id: string) {
    return couponRepository.remove(id);
  }
};
