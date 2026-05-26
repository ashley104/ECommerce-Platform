import { revalidatePath } from "next/cache";
import { deleteProduct } from "@repo/db/products";

export async function DELETE(_request: Request) {
  try {
    const url = new URL(_request.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const idParam = segments[segments.length - 1];

    if (!idParam) {
      return Response.json({ error: "Missing product ID" }, { status: 400 });
    }

    const productId = Number(idParam);

    if (Number.isNaN(productId)) {
      return Response.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await deleteProduct(productId);

    revalidatePath("/dashboard");
    revalidatePath("/");

    return Response.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);

    return Response.json(
      {
        error: "Unable to delete this product. It may already be attached to an order.",
      },
      { status: 500 }
    );
  }
}
