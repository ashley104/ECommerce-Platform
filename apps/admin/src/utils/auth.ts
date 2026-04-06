// import jwt from "jsonwebtoken";
// import { env } from "@repo/env/admin"

import { cookies } from "next/headers";

const PASSWORD = "123";

export async function isLoggedIn() {
  const userCookies = await cookies();

  // ASSIGNMENT 2
  // check only that "auth_token" cookie exists
  return userCookies.has("auth_token");

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
  });

  return true;
}

export async function logout() {
  const userCookies = await cookies();
  userCookies.delete("auth_token");
}