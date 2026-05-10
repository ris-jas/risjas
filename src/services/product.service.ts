import { productRepository } from "@/repositories/product.repository";
import { ProductFilters } from "@/types";

export const productService = {
  list(filters: ProductFilters) {
    return productRepository.list(filters);
  },

  listAdmin() {
    return productRepository.listAdmin();
  },

  findBySlug(slug: string) {
    return productRepository.findBySlug(slug);
  },

  async findWithRelated(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) return null;

    const related = await productRepository.related(product.categoryId, product.id);
    return { product, related };
  },

  create(data: any) {
    return productRepository.create(data);
  },

  update(id: string, data: any) {
    return productRepository.update(id, data);
  },

  remove(id: string) {
    return productRepository.remove(id);
  },

  findById(id: string) {
    return productRepository.findById(id);
  }
};
