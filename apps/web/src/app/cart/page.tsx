import CartPage from "@/components/Product/CartPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/dist/client/components/navigation";

export default async function CartRoute() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return <CartPage />;
}