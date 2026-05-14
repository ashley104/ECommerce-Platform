import { notFound, redirect } from "next/navigation";
import { client } from "@repo/db/client";

import ProductFormPage from "../../../../components/dashboard/ProductFormPage";
import { isLoggedIn } from "../../../../utils/auth";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/");
  }

  const id = Number((await params).id);

  if (!Number.isInteger(id)) {
    notFound();
  }

  const product = await client.db.product.findUnique({ where: { id } });

  if (!product) {
    notFound();
  }

  return (
   <h1>Edit Product</h1>
  );
}
