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

  const categoryDefs = [
    { name: "Cooling Gadgets", slug: "cooling-gadgets" },
    { name: "Cute Gifts", slug: "cute-gifts" },
    { name: "Kitchen Tools", slug: "kitchen-tools" },
    { name: "Drinkware", slug: "drinkware" },
    { name: "New Drops", slug: "new-drops" },
    { name: "Smart Gadgets", slug: "smart-gadgets" },
    { name: "Aesthetic Decor", slug: "aesthetic-decor" },
    { name: "Kitchen & Dining", slug: "kitchen-dining" },
    { name: "Trending Now", slug: "trending-now" },
    { name: "Best Sellers", slug: "best-sellers" },
    { name: "Lifestyle", slug: "lifestyle" }
  ];

  const categories = [];
  for (const category of categoryDefs) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, isActive: true },
      create: { name: category.name, slug: category.slug, isActive: true }
    });
    categories.push(saved);
  }

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\+/g, "plus")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const productImage = (slug: string) => [`/products/generated/${slug}.png`];

  const dynamicCatalog: Record<string, string[]> = {
    "new-drops": [
      "Galaxy Astronaut Projector",
      "Digital Tape Measure",
      "Magnetic Levitation Floating Plant Pot",
      "Crystal Hair Eraser",
      "Retro Bluetooth Speaker",
      "Smart Coffee Mug Warmer",
      "Electric Spin Scrubber",
      "Cloud Bread Lamp",
      "Anti-Gravity Humidifier",
      "Portable Mini Label Printer"
    ],
    "smart-gadgets": [
      "Mini Mist Fan Cooler",
      "Electric Lint Remover",
      "3-in-1 Foldable Wireless Charger",
      "Smart Temperature Display Bottle",
      "Portable Electric Candle Lighter",
      "Screen Cleaning Kit",
      "Mini Cordless Vacuum",
      "Fingerprint Padlock",
      "Motion Sensor Wardrobe Lights",
      "Neck Hanging Fan"
    ],
    "aesthetic-decor": [
      "Cute Panda Night Lamp",
      "Tulip Mirror Night Light",
      "Sand Art Liquid Motion Frame",
      "Acrylic LED Note Board",
      "Sunset Lamp",
      "Tulip Shaped Ceramic Vase",
      "3D Moon Lamp",
      "Minimalist Kinetic Desk Toy",
      "Fake Ivy Vines with LED String",
      "Bubble Shaped Scented Candles"
    ],
    "kitchen-dining": [
      "Portable Mixture Juicer",
      "Slice Aesthetic Water Bottle",
      "Electric Milk Frother",
      "Mini Heat Bag Sealer",
      "Oil Spray Bottle",
      "Electric Salt and Pepper Grinder",
      "Silicone Stretch Lids Set",
      "Multi-function Veggie Chopper",
      "Aesthetic Cereal Salad Bowls",
      "Automatic Water Dispenser Pump"
    ],
    "trending-now": [
      "Flame Effect Air Humidifier",
      "TikTok Remote Shutter Scroller",
      "RGB Corner Floor Lamp",
      "Automatic Pet Feeder and Waterer",
      "Electric Scalp Massager",
      "DIY Punch Needle Kit",
      "Quirky Puffy Phone Case",
      "Tile Key Finder Tracker",
      "Weighted Blanket",
      "Infinity Cube Fidget Toy"
    ],
    "best-sellers": [
      "Mini Massage Gun",
      "Universal Travel Adapter",
      "Cute Animal Cable Protectors",
      "Phone Screen Magnifier",
      "Vanity Mirror with LED Lights",
      "Mosquito Killer Lamp",
      "Travel Makeup Organizer Bag",
      "Reusable Silicone Drinking Straws",
      "Memory Foam Neck Pillow",
      "Transparent Waterproof Phone Pouch"
    ],
    lifestyle: [
      "Silk Eye Mask and Scrunchie Set",
      "Acupressure Massage Slippers",
      "Portable Jewelry Organizer Box",
      "Blue Light Blocking Glasses",
      "Foldable Shopping Tote Bag",
      "Mini First-Aid Kit",
      "Essential Oil Diffuser",
      "Cute 3D Keychain",
      "Collapsible Silicone Cup",
      "Microfiber Hair Drying Turban"
    ]
  };

  const categoryPricing: Record<string, { mrp: number; price: number }> = {
    "new-drops": { mrp: 1999, price: 1299 },
    "smart-gadgets": { mrp: 1899, price: 1199 },
    "aesthetic-decor": { mrp: 1599, price: 999 },
    "kitchen-dining": { mrp: 1799, price: 1149 },
    "trending-now": { mrp: 2099, price: 1399 },
    "best-sellers": { mrp: 1699, price: 1099 },
    lifestyle: { mrp: 1499, price: 899 }
  };

  const baseProducts = [
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
      stock: 50,
      isFeatured: true,
      isBestSeller: true,
      categorySlug: "cooling-gadgets",
      images: productImage("mini-mist-fan-cooler")
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
      stock: 50,
      isFeatured: true,
      isBestSeller: true,
      categorySlug: "cute-gifts",
      images: productImage("cute-panda-night-lamp")
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
      stock: 50,
      isFeatured: true,
      isBestSeller: true,
      categorySlug: "kitchen-tools",
      images: productImage("rechargeable-portable-juicer")
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
      stock: 50,
      isFeatured: true,
      isBestSeller: true,
      categorySlug: "drinkware",
      images: productImage("premium-vacuum-flask-bottle")
    }
  ];

  const generatedProducts = Object.entries(dynamicCatalog).flatMap(([categorySlug, names], categoryIndex) => {
    const pricing = categoryPricing[categorySlug];

    return names.map((name, itemIndex) => {
      const slug = slugify(name);
      const mrp = pricing.mrp + (itemIndex % 3) * 100;
      const price = pricing.price + (itemIndex % 3) * 80;
      const sku = `RIS-${categorySlug.slice(0, 3).toUpperCase()}-${String(itemIndex + 1).padStart(3, "0")}-${categoryIndex + 1}`;

      return {
        name,
        slug,
        sku,
        shortDescription: `${name} - premium quality product for daily smart lifestyle use.`,
        description: `${name} is a practical and trendy pick from Risjas. Designed for everyday convenience, attractive style, and reliable performance.`,
        highlights: ["Modern design", "Easy to use", "Durable build", "Perfect for daily use"],
        specifications: {
          category: categorySlug,
          material: "Premium quality mixed material",
          usage: "Home / Office / Travel",
          stockMode: "Ready stock"
        },
        mrp,
        price,
        stock: 50,
        isFeatured: categorySlug === "new-drops" || categorySlug === "trending-now",
        isBestSeller: categorySlug === "best-sellers",
        categorySlug,
        images: productImage(slug)
      };
    });
  });

  const products = [...baseProducts, ...generatedProducts];

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
