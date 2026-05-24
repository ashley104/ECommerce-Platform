import Link from "next/link";
import { redirect } from "next/navigation";
import { getProductsForAdmin } from "@repo/db/products";
import { listOrders } from "@repo/db/orders";

import { isLoggedIn } from "../../utils/auth";
import Dashboard from "../../components/dashboard/Dashboard";
import OrdersPanel from "../../components/dashboard/OrdersPanel";
import ProductsPanel from "../../components/dashboard/ProductsPanel";

type DashboardTab = "products" | "orders";

type DashboardProps = {
  searchParams?: Promise<{
    tab?: string | string[];
  }>;
};

export default async function DashboarPage({ searchParams }: DashboardProps) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/");
  }

  const params = await searchParams;
  //take the first value if it's an array, otherwise take the string value
  const tabParam = Array.isArray(params?.tab) ? params?.tab[0] : params?.tab;
  //default to products tab if the tab param is not valid
  const activeTab: DashboardTab = tabParam === "orders" ? "orders" : "products";

  //fetch products and orders in parallel
  const [products, orders] = await Promise.all([getProductsForAdmin(), listOrders()]);

  return (
    <Dashboard
      products={products}
      orders={orders}
      activeTab={activeTab}
      actions={
        activeTab === "products" ? (
          <Link
            href="/products/create"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            + Add Product
          </Link>
        ) : null
      }
    >

      {activeTab === "products" ? (
        <h1>Products</h1>
      ) : (
        <h1>Orders</h1>
      )}
    </Dashboard>
  );
}
