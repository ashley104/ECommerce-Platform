import { seed } from "@repo/db/seed";
import { expect, test, type Page } from "./fixtures";

// test.beforeAll(async () => {
//   await seed();
// });

async function addFirstAvailableProduct(page: Page) {
  await page.goto("/");

  const firstProduct = page.locator("article").first();
  await firstProduct.getByRole("button", { name: /add|add more/i }).click();
  return firstProduct;
}

test.describe("STOREFRONT - CHECKOUT", () => {
  test("completes checkout and shows success state", { tag: "@a1" }, async ({ page }) => {
    await addFirstAvailableProduct(page);
    await page.getByRole("button", { name: /cart/i }).click();

    await page.route("**/api/checkout", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "/success" }),
      });
    });

    await page.route("**/api/orders", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ order: { id: "test-order" } }),
      });
    });

    await expect(page.getByRole("button", { name: /proceed to checkout/i })).toBeVisible();
    await page.getByRole("button", { name: /proceed to checkout/i }).click();

    await expect(page).toHaveURL(/\/success/);
    await expect(page.getByRole("heading", { name: /payment successful/i })).toBeVisible();

    await page.goto("/cart");
    await expect(page.getByText(/your cart is empty/i)).toBeVisible();
  });
});