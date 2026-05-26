import { expect, test } from "./fixtures";
import { createPaidOrderForStorefrontUser, deleteOrder } from "../helpers/orders";

test("displays purchase history in the storefront", { tag: "@1"}, async ({ page }) => {
  const orderId = await createPaidOrderForStorefrontUser(1);

  try {
    await page.goto("/purchase-history");

    await expect(page.getByRole("heading", { name: /purchase history/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /wireless headphones/i })).toBeVisible();
    await expect(page.getByText(/total amount/i)).toBeVisible();
  } finally {
    await deleteOrder(orderId);
  }
});