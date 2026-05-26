import { client } from "@repo/db/client";

import { expect, test } from "./fixtures";

test("creates a product", { tag: "@a2" }, async ({ page }) => {
  const productName = `Playwright Test Product ${Date.now()}`;

  try {
    await page.goto("/products/create");

    await page.getByLabel(/product name/i).fill(productName);
    await page.getByLabel(/^category$/i).fill("Electronics");
    await page.getByLabel(/^image url$/i).fill("https://example.com/test-product.jpg");
    await page.getByLabel(/^price$/i).fill("19.99");
    await page.getByLabel(/^stock$/i).fill("5");
    await page.getByLabel(/^description$/i).fill("A concise test product for Playwright.");

    await page.getByRole("button", { name: /create product/i }).click();

    await expect(page).toHaveURL(/\/dashboard\?tab=products/);
    await expect(page.getByText(productName)).toBeVisible();
  } finally {
    await client.db.product.deleteMany({ where: { name: productName } });
  }
});