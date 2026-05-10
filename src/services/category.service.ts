import { categoryRepository } from "@/repositories/category.repository";

export const categoryService = {
  listActive() {
    return categoryRepository.listActive();
  },

  listAdmin() {
    return categoryRepository.listAdmin();
  },

  create(data: any) {
    return categoryRepository.create(data);
  },

  update(id: string, data: any) {
    return categoryRepository.update(id, data);
  },

  remove(id: string) {
    return categoryRepository.remove(id);
  },

  findById(id: string) {
    return categoryRepository.findById(id);
  }
};
