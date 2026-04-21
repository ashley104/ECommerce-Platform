"use server";

import { login, logout } from "../../utils/auth";
import { redirect } from "next/navigation";

export async function handleLogin(formData: FormData) {
  const password = formData.get("password") as string;

  const success = await login(password);

  if (!success) {
    return;
  }

  redirect("/"); // reload root
}

export async function handleLogout() {
  await logout();
  redirect("/");
}