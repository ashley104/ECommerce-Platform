import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

// test.beforeAll(async () => {
//   await seed();
// });

test.describe("STOREFRONT - PRODUCTS", () => {
  test("renders the product catalog", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: /products/i })).toBeVisible();

    const productCard = page.locator("article").filter({
      has: page.getByRole("heading", { name: /wireless headphones/i }),
    }).first();

    await expect(productCard).toBeVisible();
    await expect(productCard.getByRole("button", { name: /add/i })).toBeVisible();
  });

  test("searches products by name", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");

    await page.getByPlaceholder("Search products...").fill("laptop");

    await expect(page.getByRole("heading", { name: /laptop stand/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /coffee maker/i })).not.toBeVisible();
  });

  test("filters products by category", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/");

    await page.getByRole("combobox").selectOption("Electronics");

    await expect(page.getByRole("heading", { name: /wireless headphones/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /laptop stand/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /coffee maker/i })).not.toBeVisible();
  });
});