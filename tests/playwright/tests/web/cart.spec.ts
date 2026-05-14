import { seed } from "@repo/db/seed";
import { expect, test, type Page } from "./fixtures";

// test.beforeAll(async () => {
//   await seed();
// });

async function addFirstAvailableProduct(page: Page) {
  await page.goto("/");

  const firstProduct = page.locator("article").first();
  await firstProduct.getByRole("button", { name: /^Add$/ }).click();

  return firstProduct;
}

test.describe("STOREFRONT - CART", () => {
  test("adds a product and opens the cart", { tag: "@a1" }, async ({ page }) => {
    const productCard = await addFirstAvailableProduct(page);

    await expect(productCard.getByRole("button", { name: /added|add more/i })).toBeVisible();
    await page.getByRole("link", { name: /cart/i }).click();

    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByRole("heading", { name: /review your items/i })).toBeVisible();
    await expect(page.locator("article")).toHaveCount(1);

    const cartItem = page.locator("article").first();
    await expect(cartItem.getByRole("button", { name: /decrease quantity/i })).toBeVisible();
    await expect(cartItem.getByRole("button", { name: /increase quantity/i })).toBeVisible();
    await expect(cartItem.getByRole("button", { name: /remove/i })).toBeVisible();
    await expect(page.getByText(/order summary/i)).toBeVisible();
  });

  test("updates quantity and visible totals", { tag: "@a1" }, async ({ page }) => {
    await addFirstAvailableProduct(page);
    await page.getByRole("link", { name: /cart/i }).click();

    const cartItem = page.locator("article").first();
    const quantity = cartItem.locator("span").filter({ hasText: /^\d+$/ }).first();
    const total = page.locator("aside").getByText(/^\$\d+/).last();

    const initialQuantity = Number(await quantity.textContent());
    const initialTotal = await total.textContent();

    await page.getByRole("button", { name: /increase quantity/i }).first().click();
    await expect(quantity).toHaveText(String(initialQuantity + 1));
    await expect(total).not.toHaveText(initialTotal || "");

    await page.getByRole("button", { name: /decrease quantity/i }).first().click();
    await expect(quantity).toHaveText(String(initialQuantity));
  });

  test("removes an item from the cart", { tag: "@a1" }, async ({ page }) => {
    await addFirstAvailableProduct(page);
    await page.getByRole("link", { name: /cart/i }).click();

    await page.getByRole("button", { name: /remove/i }).first().click();

    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });

  test("shows the empty cart state", { tag: "@a1" }, async ({ page }) => {
    await page.goto("/cart");

    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /continue shopping/i })).toBeVisible();
  });
});