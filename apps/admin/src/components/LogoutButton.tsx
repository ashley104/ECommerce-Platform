'use client';

import { useRouter } from "next/navigation";

export default function LogoutButton({
  onLogoutStart,
}: {
  onLogoutStart?: () => void;
}) {
  const router = useRouter();

  async function handleLogout() {
    onLogoutStart?.();

    await fetch("/api/auth", {
      method: "DELETE",
    });

    router.refresh();
    router.push("/");
  }

  return (
    <button 
      onClick={handleLogout} 
      className="bg-white text-[#1A5134] hover:bg-gray-100 rounded-md px-3 py-2 font-medium">
      Logout
    </button>
  );
}