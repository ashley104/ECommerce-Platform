import { getCategories, getProductsForWeb } from "@repo/db/products";
import ProductList from "./Product/ProductList";

export async function Main({
  className,
} : {
  className?: string;
}) {
  const products = await getProductsForWeb();
  const categories = await getCategories();
  
  return (
    <main className={className}>
      <ProductList products={products} categories={categories} />;
    </main>
  );
}
