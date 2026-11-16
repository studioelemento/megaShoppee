import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categoryData = [
    { name: 'Electronics', slug: 'electronics', sortOrder: 1 },
    { name: 'Fashion', slug: 'fashion', sortOrder: 2 },
    { name: 'Home & Living', slug: 'home-living', sortOrder: 3 },
    { name: 'Toys & Games', slug: 'toys-games', sortOrder: 4 },
    { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', sortOrder: 5 },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors', sortOrder: 6 },
  ];
  for (const category of categoryData) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, sortOrder: category.sortOrder, isActive: true },
      create: category,
    });
  }

  const vendor = await prisma.vendor.upsert({
    where: { storeSlug: 'megashoppee-demo-store' },
    update: {},
    create: {
      name: 'Megashoppee Demo Store',
      storeSlug: 'megashoppee-demo-store',
      type: 'BUSINESS',
      status: 'APPROVED',
      email: 'demo@megashoppee.local',
      mobile: '9000000000',
    },
  });

  const electronics = await prisma.category.findUniqueOrThrow({ where: { slug: 'electronics' } });
  await prisma.product.upsert({
    where: { slug: 'wireless-bluetooth-speaker-demo' },
    update: {},
    create: {
      vendorId: vendor.id,
      categoryId: electronics.id,
      title: 'Wireless Bluetooth Speaker',
      slug: 'wireless-bluetooth-speaker-demo',
      description: 'Demo listing used to verify the storefront-to-API-to-MySQL connection.',
      kind: 'SIMPLE',
      status: 'ACTIVE',
      regularPrice: 1499,
      salePrice: 1199,
      sku: 'DEMO-SPK-001',
      stock: 25,
      images: [],
    },
  });

  console.log('Megashoppee seed completed.');
}

main()
  .catch((error) => { console.error(error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
