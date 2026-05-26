import { client } from "./client.js";

async function syncProductIdSequence() {
  await client.db.$executeRaw`
    SELECT setval(
      pg_get_serial_sequence('"Product"', 'id'),
      COALESCE((SELECT MAX(id) FROM "Product"), 0) + 1,
      false
    )
  `;
}

export async function getProductsForWeb() {
  const products = await client.db.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });
  const formattedProducts = products.map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));

  return formattedProducts;
}

export async function getCategories() {
  const categories = await client.db.product.groupBy({
    by: ["category"],
  });

  return categories.map((c) => c.category);
}

export async function getProductsForAdmin() {
  const products = await client.db.product.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      imageUrl: true,
      price: true,
      stock: true,
      active: true,
      category: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  const formattedProducts = products.map((p) => ({
    ...p,
    price: p.price.toNumber(),
  }));

  return formattedProducts;
}

export async function slugExists(slug: string, existingProductId?: number) {
  const product = await client.db.product.findFirst({
    where: {
      slug, // Check if slug exists, excluding the current product if editing
      ...(existingProductId ? { id: { not: existingProductId } } : {}),
    },
    select: { id: true },
  });

  return !!product; // Return true if a product with the slug exists, false otherwise
}

export async function createProduct(data: {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  stock?: number;
  category: string;
}) {
  await syncProductIdSequence();

  const product = await client.db.product.create({
    data: {
      slug: data.slug,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      price: data.price,
      stock: data.stock ?? 0,
      category: data.category,
    },
  });

  return product;
}

export async function updateProduct(
  id: number,
  data: Partial<{
    slug: string;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    stock: number;
    active: boolean;
    category: string;
  }>
) {
  const updated = await client.db.product.update({ where: { id }, data: data as any });
  return updated;
}

export async function getProductById(id: number) {
  const product = await client.db.product.findUnique({ where: { id } });
  if (!product) {
    return null;
  }
  return {
    ...product,
    price: product.price.toNumber(),
  };
}

export async function deleteProduct(id: number) {
  await client.db.product.delete({ where: { id } });
}