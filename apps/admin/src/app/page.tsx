import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserRoleFromSession } from "@repo/db/users";
import { getProductsForAdmin } from "@repo/db/products";
import { listOrders } from "@repo/db/orders";
import Dashboard from "../components/dashboard/Dashboard";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  } else {
    const userRole = await getUserRoleFromSession(session);
    if (userRole !== "ADMIN") {
      redirect("/login");
    }
  }

  redirect("/dashboard");
}