import "dotenv/config";

import { test as setup } from "@playwright/test";
import { encode } from "next-auth/jwt";
import fs from "fs";
import path from "path";

import { client } from "@repo/db/client";

const authDir = path.resolve(".auth");
const adminAuthFile = path.join(authDir, "admin.json");
const storefrontAuthFile = path.join(authDir, "storefront.json");

function ensureAuthDir() {
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
}

setup("authenticate admin", { tag: "@a2" }, async () => {
  ensureAuthDir();

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required to create the admin session");
  }

  const email = "admin.tester@example.com";
  const name = "Admin Tester";

  await client.db.user.upsert({
    where: { email },
    update: { name, role: "ADMIN" },
    create: {
      email,
      name,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  const token = await encode({
    secret,
    token: {
      name,
      email,
      sub: email,
    },
  });

  fs.writeFileSync(
    adminAuthFile,
    JSON.stringify(
      {
        cookies: [
          {
            name: "next-auth.session-token",
            value: token,
            domain: "localhost",
            path: "/",
            expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
          },
        ],
        origins: [],
      },
      null,
      2,
    ),
  );
});

setup("authenticate storefront", { tag: "@a1" }, async () => {
  ensureAuthDir();
  console.log("Storefront setup: Writing to", storefrontAuthFile, "CWD:", process.cwd());

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required to create the storefront session");
  }

  const email = "storefront.tester@example.com";
  const name = "Storefront Tester";

  await client.db.user.upsert({
    where: { email },
    update: { name },
    create: {
      email,
      name,
      emailVerified: new Date(),
    },
  });

  const token = await encode({
    secret,
    token: {
      name,
      email,
      sub: email,
    },
  });

  fs.writeFileSync(
    storefrontAuthFile,
    JSON.stringify(
      {
        cookies: [
          {
            name: "next-auth.session-token",
            value: token,
            domain: "localhost",
            path: "/",
            expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
          },
        ],
        origins: [],
      },
      null,
      2,
    ),
  );
  console.log("Storefront setup: File written, exists?", fs.existsSync(storefrontAuthFile));
});
