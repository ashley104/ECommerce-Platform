import { getCategories, getProductsForWeb } from "@repo/db/products";

import ProductList from "../../components/Product/ProductList";

export default async function Home() {
  const products = await getProductsForWeb();
  const categories = await getCategories();

  return <ProductList products={products} categories={categories} />;
}