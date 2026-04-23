"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function getOrigin() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") || "http";

  if (!host) {
    return "http://localhost:3002";
  }

  return `${protocol}://${host}`;
}

export async function handleLogin(formData: FormData) {
  const password = String(formData.get("password") || "");
  const origin = await getOrigin();

  const response = await fetch(`${origin}/api/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    return;
  }

  redirect("/"); // reload root
}

export async function handleLogout() {
  const origin = await getOrigin();

  await fetch(`${origin}/api/auth`, {
    method: "DELETE",
  });
  redirect("/");
}