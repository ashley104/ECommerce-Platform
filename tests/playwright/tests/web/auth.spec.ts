import { seed } from "@repo/db/seed";
import { expect, test, type Browser, type BrowserContext, type Page } from "@playwright/test";

// test.beforeAll(async () => {
//   if (process.env.SKIP_DB_SEED) {
//     console.log("Skipping DB seed because SKIP_DB_SEED is set");
//     return;
//   }

//   await seed();
// });

async function newAuthenticatedPage(browser: Browser): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext({
    storageState: ".auth/storefront.json",
  });
  const page = await context.newPage();
  return { context, page };
}

async function newAnonymousPage(browser: Browser): Promise<{ context: BrowserContext; page: Page }> {
  const context = await browser.newContext();
  const page = await context.newPage();
  return { context, page };
}

test.describe("STOREFRONT - AUTH", () => {
  test(
    "protected routes redirect unauthenticated users to login", 
    { 
      tag: "@a1" 
    },
    async ({ browser }) => {
      const { context, page } = await newAnonymousPage(browser);

      await page.goto("/");
      await expect(page).toHaveURL(/\/login/);
      await expect(page.getByRole("button", { name: /sign in with github/i })).toBeVisible();

      await page.goto("/cart");
      await expect(page).toHaveURL(/\/login/);

      await context.close();
    }
  );

  test(
    "authenticated users can open the storefront", 
    {
     tag: "@a1" 
    },
    async ({ browser }) => {
      const { context, page } = await newAuthenticatedPage(browser);

      await page.goto("/");

      await expect(page).toHaveURL(/\/$/);
      await expect(page.getByRole("heading", { name: /products/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();

      await context.close();
    }
  );

  test("logout returns the user to login", { tag: "@a1" }, async ({ browser }) => {
    const { context, page } = await newAuthenticatedPage(browser);

    await page.goto("/");
    await page.getByRole("button", { name: /logout/i }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("button", { name: /sign in with github/i })).toBeVisible();

    await context.close();
  });
});