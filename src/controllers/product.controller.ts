import { ZodError } from "zod";

import { productSchema } from "@/lib/validations/product.schema";
import { productService } from "@/services/product.service";

export const productController = {
  async getProducts(filters: Record<string, any>) {
    return productService.list({
      search: filters.search,
      category: filters.category,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      sort: filters.sort,
      featured: filters.featured === "true",
      bestSeller: filters.bestSeller === "true"
    });
  },

  async getProductBySlug(slug: string) {
    const data = await productService.findWithRelated(slug);
    if (!data) {
      throw new Error("Product not found");
    }
    return data;
  },

  async getAdminProducts() {
    return productService.listAdmin();
  },

  async getAdminProductById(id: string) {
    const product = await productService.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  },

  async createProduct(payload: any) {
    try {
      const validated = productSchema.parse(payload);
      return await productService.create(validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(error.flatten().fieldErrors));
      }
      throw error;
    }
  },

  async updateProduct(id: string, payload: any) {
    try {
      const validated = productSchema.parse(payload);
      return await productService.update(id, validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(error.flatten().fieldErrors));
      }
      throw error;
    }
  },

  async deleteProduct(id: string) {
    return productService.remove(id);
  }
};
