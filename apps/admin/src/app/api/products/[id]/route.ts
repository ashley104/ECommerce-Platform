import { revalidatePath } from "next/cache";
import { deleteProduct } from "@repo/db/products";

export async function DELETE(
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id);

    if (!productId) {
      return Response.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
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
