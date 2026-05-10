import { ZodError } from "zod";

import { categorySchema } from "@/lib/validations/category.schema";
import { categoryService } from "@/services/category.service";

export const categoryController = {
  getCategories() {
    return categoryService.listActive();
  },

  getAdminCategories() {
    return categoryService.listAdmin();
  },

  async createCategory(payload: any) {
    try {
      const data = categorySchema.parse(payload);
      return await categoryService.create(data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(error.flatten().fieldErrors));
      }
      throw error;
    }
  },

  async updateCategory(id: string, payload: any) {
    try {
      const data = categorySchema.parse(payload);
      return await categoryService.update(id, data);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(JSON.stringify(error.flatten().fieldErrors));
      }
      throw error;
    }
  },

  deleteCategory(id: string) {
    return categoryService.remove(id);
  }
};
