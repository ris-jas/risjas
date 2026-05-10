import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required for seeding");
  }

  const password = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password, role: UserRole.ADMIN, name: "Risjas Admin" },
    create: {
      email: adminEmail,
      name: "Risjas Admin",
      password,
      role: UserRole.ADMIN,
      phone: "9999999999"
    }
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "cooling-gadgets" },
      update: {},
      create: { name: "Cooling Gadgets", slug: "cooling-gadgets", isActive: true }
    }),
    prisma.category.upsert({
      where: { slug: "cute-gifts" },
      update: {},
      create: { name: "Cute Gifts", slug: "cute-gifts", isActive: true }
    }),
    prisma.category.upsert({
      where: { slug: "kitchen-tools" },
      update: {},
      create: { name: "Kitchen Tools", slug: "kitchen-tools", isActive: true }
    }),
    prisma.category.upsert({
      where: { slug: "drinkware" },
      update: {},
      create: { name: "Drinkware", slug: "drinkware", isActive: true }
    })
  ]);

  const products = [
    {
      name: "Mini Mist Fan Cooler",
      slug: "mini-mist-fan-cooler",
      sku: "RIS-MFC-001",
      shortDescription: "Portable mist cooler fan with USB charging.",
      description: "Compact cooling fan with mist spray, silent motor, and adjustable airflow for desk or bedside use.",
      highlights: ["USB rechargeable", "3 speed levels", "Mist spray mode"],
      specifications: { material: "ABS", battery: "2000mAh", charging: "USB-C", use: "Desk/bedside" },
      mrp: 1499,
      price: 999,
      stock: 80,
      isFeatured: true,
      isBestSeller: true,
      categorySlug: "cooling-gadgets",
      images: ["/products/portable-mini-air.png"]
    },
    {
      name: "Cute Panda Night Lamp (Multicolor)",
      slug: "cute-panda-night-lamp",
      sku: "RIS-PANDA-002",
      shortDescription: "Adorable soft-touch panda lamp with multi-color glow.",
      description: "USB rechargeable panda lamp with soft silicone body, warm/night modes, and tap control for kids room, bedside and gifting.",
      highlights: ["USB charging", "Soft light mode", "Multicolor ambient glow", "Gift-friendly design"],
      specifications: { material: "Silicone + ABS", charging: "USB", lightMode: "Warm + RGB", control: "Touch/Tap" },
      mrp: 1299,
      price: 849,
      stock: 90,
      isFeatured: true,
      isBestSeller: true,
      categorySlug: "cute-gifts",
      images: ["/products/cute-panda.png", "/products/panda-usb-charging.png", "/products/panda-trending-banner.png"]
    },
    {
      name: "Rechargeable Portable Juicer",
      slug: "rechargeable-portable-juicer",
      sku: "RIS-JUICER-003",
      shortDescription: "USB rechargeable mini juicer for fresh shakes and juice.",
      description: "Handy portable blender with rechargeable battery, strong blending blades, and compact travel-friendly design.",
      highlights: ["Rechargeable", "Portable", "Quick blend", "Easy to clean"],
      specifications: { battery: "1200mAh", charging: "USB", capacity: "Approx 350ml", body: "Food grade plastic" },
      mrp: 1999,
      price: 1399,
      stock: 55,
      isFeatured: true,
      isBestSeller: true,
      categorySlug: "kitchen-tools",
      images: ["/products/rechargeable-juicer.svg"]
    },
    {
      name: "Premium Vacuum Flask Bottle",
      slug: "premium-vacuum-flask-bottle",
      sku: "RIS-FLASK-004",
      shortDescription: "Stylish insulated flask bottle for hot and cold drinks.",
      description: "Leak-resistant premium vacuum flask with elegant finish and day-long temperature hold for water, tea, or coffee.",
      highlights: ["Hot & cold insulation", "Leak-proof", "Premium pastel finish", "Travel-friendly"],
      specifications: { capacity: "500ml", body: "Stainless steel", insulation: "Double-wall vacuum" },
      mrp: 1199,
      price: 749,
      stock: 120,
      isFeatured: true,
      isBestSeller: true,
      categorySlug: "drinkware",
      images: ["/products/flask-400ml.png"]
    }
  ];

  for (const item of products) {
    const category = categories.find((c) => c.slug === item.categorySlug);
    if (!category) continue;

    const discountPercent = Math.max(0, Math.round(((item.mrp - item.price) / item.mrp) * 100));

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        sku: item.sku,
        shortDescription: item.shortDescription,
        description: item.description,
        highlights: item.highlights,
        specifications: item.specifications,
        mrp: item.mrp,
        price: item.price,
        discountPercent,
        stock: item.stock,
        categoryId: category.id,
        isFeatured: item.isFeatured,
        isBestSeller: item.isBestSeller,
        isActive: true
      },
      create: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        shortDescription: item.shortDescription,
        description: item.description,
        highlights: item.highlights,
        specifications: item.specifications,
        mrp: item.mrp,
        price: item.price,
        discountPercent,
        stock: item.stock,
        categoryId: category.id,
        isFeatured: item.isFeatured,
        isBestSeller: item.isBestSeller,
        isActive: true
      }
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: item.images.map((imageUrl, index) => ({
        productId: product.id,
        imageUrl,
        publicId: `local-${item.slug}-${index + 1}`,
        sortOrder: index
      }))
    });
  }

  await prisma.banner.upsert({
    where: { id: "risjas-home-banner" },
    update: {
      title: "Fresh New Trendy Collection",
      subtitle: "Cute gifts, smart gadgets, and daily-use essentials at best prices",
      imageUrl: "/products/panda-trending-banner.png",
      publicId: "local-banner",
      buttonText: "Shop New Arrivals",
      buttonLink: "/products",
      isActive: true
    },
    create: {
      id: "risjas-home-banner",
      title: "Fresh New Trendy Collection",
      subtitle: "Cute gifts, smart gadgets, and daily-use essentials at best prices",
      imageUrl: "/products/panda-trending-banner.png",
      publicId: "local-banner",
      buttonText: "Shop New Arrivals",
      buttonLink: "/products",
      isActive: true
    }
  });

  const sampleProduct = await prisma.product.findFirst({ where: { slug: "cute-panda-night-lamp" } });
  if (sampleProduct) {
    await prisma.review.deleteMany({ where: { productId: sampleProduct.id, name: "Ananya" } });
    await prisma.review.create({
      data: {
        productId: sampleProduct.id,
        name: "Ananya",
        rating: 5,
        comment: "Cute design and very soothing light. Perfect gift product!",
        isApproved: true
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
