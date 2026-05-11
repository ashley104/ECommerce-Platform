import { client } from "./client.js";
import type { Product } from "./data.js";

export async function getProductsForWeb() {
  const products = await client.db.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return products;
}

export async function getProductsForAdmin() {
  const products = await client.db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return products;
}

export async function getCategories() {
  const categories = await client.db.product.groupBy({
    by: ["category"],
  });

  return categories.map((c) => c.category);
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

export async function deleteProduct(id: number) {
  await client.db.product.delete({ where: { id } });
}

export async function getProductBySlug(slug: string) {
  return client.db.product.findUnique({ where: { slug } });
}