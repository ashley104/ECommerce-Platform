import { expect, test } from "./fixtures";

test.describe("ADMIN - AUTH", () => {
  test("redirects unauthenticated users away from protected admin routes", { tag: "@a2" }, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      baseURL: "http://localhost:3002",
      storageState: { cookies: [], origins: [] },
    });

    const page = await context.newPage();

    await page.goto("/dashboard", { waitUntil: "commit" });
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/products/create", { waitUntil: "commit" });
    await expect(page).toHaveURL(/\/login/);

    await context.close();
  });

  test("authenticated admin can access the dashboard", { tag: "@a2" }, async ({ page }) => {
    await page.goto("/dashboard");

    await expect(
      page.getByRole("heading", { name: /admin dashboard/i }),
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: /products/i }),
    ).toBeVisible();
  });
});