// import jwt from "jsonwebtoken";
// import { env } from "@repo/env/admin"

import { cookies } from "next/headers";

const PASSWORD = "123";

export async function isLoggedIn() {
  const userCookies = await cookies();

  // ASSIGNMENT 2
  // accept both the current auth cookie and legacy assignment setup cookie
  const authToken = userCookies.get("auth_token")?.value;
  const legacyPassword = userCookies.get("password")?.value;
  return authToken === "valid" || legacyPassword === PASSWORD;

  // ASSIGNMENT 3
  // check that auth_token cookie exists and is valid
  // const token = userCookies.get("auth_token")?.value;

  // return token && jwt.verify(token, env.JWT_SECRET || "");
}

export async function login(password: string) {
  if (password !== PASSWORD) return false;

  const userCookies = await cookies();

  userCookies.set("auth_token", "valid", {
    httpOnly: true, //stops JavaScript from accessing the cookie
    path: "/", //cookie is sent for all routes
  });

  return true;
}

export async function logout() {
  const userCookies = await cookies();
  userCookies.delete({ name: "auth_token", path: "/" });
  userCookies.delete({ name: "password", path: "/" });
}