import { expect, test } from "./fixtures";
import { createPaidOrderForStorefrontUser, deleteOrder } from "../helpers/orders";

test("displays the admin order list", { tag: "@a2" }, async ({ page }) => {
  const orderId = await createPaidOrderForStorefrontUser(1);

  try {
    await page.goto("/dashboard?tab=orders");

    await expect(page.getByRole("heading", { name: /purchase records/i })).toBeVisible();

    const orderCard = page.locator("article").filter({ hasText: /storefront\.tester@example\.com/i }).first();

    await expect(orderCard).toBeVisible();
    await expect(orderCard.getByText(/wireless headphones/i)).toBeVisible();
  } finally {
    await deleteOrder(orderId);
  }
});