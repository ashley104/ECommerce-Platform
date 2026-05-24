import { notFound, redirect } from "next/navigation";
import { getUserRoleFromSession } from "@repo/db/users";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getProductById } from "@repo/db/products";
import ProductFormPage from "../../../../components/dashboard/ProductFormPage";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  } else {
    const userRole = await getUserRoleFromSession(session);
    if (userRole !== "ADMIN") {
      redirect("/login");
    }
  }

  const id = Number((await params).id);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <ProductFormPage
      mode="edit"
      initialFields={product}
    />
  );
}
