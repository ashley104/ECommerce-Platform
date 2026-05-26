import "dotenv/config";

import { test as base } from "@playwright/test";

export const test = base;

test.use({
  storageState: ".auth/admin.json",
  baseURL: "http://localhost:3002",
});

export * from "@playwright/test";
