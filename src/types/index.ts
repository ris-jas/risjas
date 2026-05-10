import { UserRole } from "@prisma/client";

export type AppSessionUser = {
  id: string;
  role: UserRole;
  email?: string | null;
  name?: string | null;
};

export type ProductFilters = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc";
  featured?: boolean;
  bestSeller?: boolean;
};
