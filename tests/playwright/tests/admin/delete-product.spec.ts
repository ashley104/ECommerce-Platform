import { client } from "@repo/db/client";
import { createProduct } from "@repo/db/products";

import { expect, test } from "./fixtures";

test("deletes a product", { tag: "@a2" }, async ({ page }) => {
  const productName = `Playwright Delete Product ${Date.now()}`;
  const product = await createProduct({
    slug: `playwright-delete-product-${Date.now()}`,
    name: productName,
    description: "Temporary product for delete coverage.",
    imageUrl: "https://example.com/delete-product.jpg",
    price: 12.5,
    stock: 3,
    category: "Electronics",
  });

  try {
    await page.goto("/dashboard?tab=products");

    page.once("dialog", (dialog) => dialog.accept());
    const deleteResponse = page.waitForResponse(
      (response) => response.request().method() === "DELETE" && response.url().includes(`/api/products/${product.id}`),
    );
    await page.getByRole("button", { name: new RegExp(`delete ${productName}`, "i") }).click();
    await deleteResponse;

    await expect(page.getByRole("row", { name: new RegExp(productName, "i") })).toHaveCount(0);
  } finally {
    await client.db.product.deleteMany({ where: { id: product.id } });
  }
});