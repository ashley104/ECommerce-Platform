import { client } from "./client.js";

type ProductRow = {
  id: number;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string | number;
  stock: number;
  active: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

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

export async function getProductsByCategory(categorySlug: string) {
  return client.db.product.findMany({
    where: { active: true, category: categorySlug },
  });
}

export async function getProductBySlug(slug: string) {
  return client.db.product.findUnique({ where: { slug } });
}

export async function createProduct(data: {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string | number;
  stock?: number;
  category: string;
}) {
  const product = await client.db.product.create({
    data: {
      slug: data.slug,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      price: data.price as any,
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
    price: string | number;
    stock: number;
    active: boolean;
    category: string;
  }>
) {
  const updated = await client.db.product.update({ where: { id }, data: data as any });
  return updated;
}

export async function setProductActiveById(id: number, active: boolean) {
  return client.db.product.update({ where: { id }, data: { active } });
}

export async function decreaseProductStock(id: number, qty: number) {
  return client.db.product.update({ where: { id }, data: { stock: { decrement: qty } } });
}
