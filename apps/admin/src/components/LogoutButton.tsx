'use client';

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  async function handleLogout() {
    const [{ url }] = await Promise.all([
      signOut({ redirect: false, callbackUrl: "/" }),
      fetch("/api/auth", {
        method: "DELETE",
      }),
    ]);

    window.location.href = url || "/";
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md bg-white px-3 py-2 font-medium text-[#1A5134] hover:bg-gray-100"
    >
      Logout
    </button>
  );
}