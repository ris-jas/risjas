export const BRAND_NAME = "Risjas";
export const BRAND_TAGLINE = "Trendy Products, Gadgets & Lifestyle Store";
export const SHIPPING_CHARGE = 49;
export const FREE_SHIPPING_THRESHOLD = 999;
export const CART_COOKIE_KEY = "risjas_cart_id";

export const ORDER_STATUS_FLOW = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED"
] as const;
