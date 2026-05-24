import Link from "next/link";
import { redirect } from "next/navigation";
import { getProductsForAdmin } from "@repo/db/products";
import { listOrders } from "@repo/db/orders";
import Dashboard from "../../components/dashboard/Dashboard";
import { getUserRoleFromSession } from "@repo/db/users";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import OrdersPanel from "../../components/dashboard/OrdersPanel";
import ProductsPanel from "../../components/dashboard/ProductsPanel";

type DashboardTab = "products" | "orders";

type DashboardProps = {
  searchParams?: Promise<{
    tab?: string | string[];
  }>;
};

export default async function DashboarPage({ searchParams }: DashboardProps) {

  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  } else {
    const userRole = await getUserRoleFromSession(session);
    if (userRole !== "ADMIN") {
      redirect("/login");
    }
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
        <ProductsPanel products={products} />
      ) : (
        <h1>Orders</h1>
      )}
    </Dashboard>
  );
}
