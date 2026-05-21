import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      slug: true
    }
  });

  for (const product of products) {
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        imageUrl: `/products/generated/${product.slug}.png`,
        publicId: `generated-${product.slug}-1`,
        sortOrder: 0
      }
    });
  }

  console.log(`Updated ${products.length} product image records.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
