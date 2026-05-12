import { PrismaClient } from '@prisma/client';
import { initialProducts } from './data.js';
export async function seed() {
  const client = new PrismaClient();
  console.log("🌱 Seeding data");
  for (const product of initialProducts) {
    await client.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        stock: product.stock,
        slug: product.slug,
      },
    });
  }
}
