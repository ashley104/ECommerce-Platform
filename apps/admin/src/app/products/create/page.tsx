import { redirect } from "next/navigation";

import ProductFormPage from "../../../components/dashboard/ProductFormPage";
import { isLoggedIn } from "../../../utils/auth";

export default async function CreateProductPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/");
  }

  return (
   <h1>Create Product</h1>
  );
}
