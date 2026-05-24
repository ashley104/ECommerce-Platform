import { redirect } from "next/navigation";
import { getUserRoleFromSession } from "@repo/db/users";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ProductFormPage from "../../../components/dashboard/ProductFormPage";
import type { Product } from "@repo/db/data";

export default async function CreateProductPage() {

  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  } else {
    const userRole = await getUserRoleFromSession(session);
    if (userRole !== "ADMIN") {
      redirect("/login");
    }
  }

  const initialProduct: Product = {
    id: 0,
    name: "",
    slug: "",
    description: "",
    price: 0,
    imageUrl: "",
    category: "",
    stock: 0
  }

  return (
    <ProductFormPage 
      mode="create"
      initialFields = {initialProduct}
    />
  );
}
