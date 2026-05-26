import { expect, test } from "./fixtures";

test("displays the admin product list", { tag: "@a2" }, async ({ page }) => {
  await page.goto("/dashboard?tab=products");

  await expect(page.getByRole("heading", { name: /admin dashboard/i })).toBeVisible();
  await expect(page.getByRole("row", { name: /wireless headphones/i })).toBeVisible();
  await expect(page.getByRole("row", { name: /coffee maker/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /add product/i })).toBeVisible();
});