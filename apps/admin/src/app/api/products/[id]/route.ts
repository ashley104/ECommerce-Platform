import { revalidatePath } from "next/cache";
import { client } from "@repo/db/client";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const productId = Number(params.id);

    // if (!productId) {
    //   return Response.json(
    //     { error: "Invalid product ID" },
    //     { status: 400 }
    //   );
    // }

    // await client.db.product.delete({ where: { id: productId } });

    // revalidatePath("/dashboard");
    // revalidatePath("/");

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
