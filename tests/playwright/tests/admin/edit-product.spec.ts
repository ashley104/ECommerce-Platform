import { client } from "@repo/db/client";

import { expect, test } from "./fixtures";

const productId = 7;
const originalProduct = {
  name: "Laptop Stand",
  description: "Adjustable aluminum laptop stand for ergonomic working",
  imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
  category: "Electronics",
  price: 49.99,
  stock: 35,
};

test("edits a product", { tag: "@a2" }, async ({ page }) => {
  const updatedName = "Laptop Stand Pro";

  try {
    await page.goto(`/products/${productId}/edit`);

    await page.getByLabel(/product name/i).fill(updatedName);
    await page.getByRole("button", { name: /save changes/i }).click();

    await expect(page).toHaveURL(/\/dashboard\?tab=products/);
    await expect(page.getByText(updatedName)).toBeVisible();
  } finally {
    await client.db.product.update({
      where: { id: productId },
      data: originalProduct,
    });
  }
});