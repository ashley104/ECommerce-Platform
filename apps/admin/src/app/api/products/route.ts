import { revalidatePath } from "next/cache";
import { createProduct, updateProduct, slugExists } from "@repo/db/products";
import { toUrlPath } from "@repo/utils/url";
import { validateProduct } from "@/lib/validations/product";

interface ProductPayload {
  id?: number;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
  active?: boolean;
}

async function createUniqueSlug(name: string, existingProductId?: number) {
  const baseSlug = toUrlPath(name) || "product";
  let slug = baseSlug;
  let suffix = 2;

  while (//while slugExists returns true, we need to generate a new slug by appending a suffix
    existingProductId      ? await slugExists(slug, existingProductId)
      : await slugExists(slug)
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProductPayload;

    // Validate input
    const errors = validateProduct({
      name: body.name,
      category: body.category,
      description: body.description,
      imageUrl: body.imageUrl,
      price: body.price,
      stock: body.stock,
    });

    if (Object.keys(errors).length > 0) {
      return Response.json(
        { errors },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(body.name, body.id);

    if (body.id) {
      // Update existing product
      await updateProduct(body.id, {
        slug,
        name: body.name,
        category: body.category,
        description: body.description,
        imageUrl: body.imageUrl,
        price: body.price,
        stock: body.stock,
        active: body.active ?? true,
      });
    } else {
      // Create new product
      await createProduct({
        slug,
        name: body.name,
        category: body.category,
        description: body.description,
        imageUrl: body.imageUrl,
        price: body.price,
        stock: body.stock,
      });
    }
    
    // Revalidate relevant paths to update the product listing and homepage
    revalidatePath("/dashboard");
    revalidatePath("/");

    return Response.json(
      { success: true, message: "Product saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving product:", error);

    return Response.json(
      { error: "Unable to save this product. Please try again." },
      { status: 500 }
    );
  }
}