import { redirect } from "next/navigation";

import ProductFormPage from "../../../components/dashboard/ProductFormPage";
import { isLoggedIn } from "../../../utils/auth";

export default async function CreateProductPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/");
  }

  return (
    <ProductFormPage
      mode="create"
      initialFields={{
        name: "",
        category: "",
        description: "",
        imageUrl: "",
        price: "",
        stock: 0,
        active: true,
      }}
    />
  );
}
