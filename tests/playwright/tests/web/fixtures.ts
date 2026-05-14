import "dotenv/config";

import { test as base, type BrowserContext } from "@playwright/test";
// TODO: Implement seed
export async function seedData(...options: any[]) {
  /* After assignment two, move the hard coded data to the seed */
}

type AppOptions = {};

export function createOptions(options: Partial<AppOptions>) {
  return JSON.stringify({});
}

export async function setOptions(
  context: BrowserContext,
  options: Partial<AppOptions>,
) {
  await context.addCookies([
    {
      name: "options",
      url: process.env.VERCEL_URL,
      value: createOptions(options),
    },
  ]);
}

export const test = base;

test.use({
  storageState: ".auth/storefront.json",
});

export * from "@playwright/test";
