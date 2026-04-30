'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({
  onLogoutStart,
}: {
  onLogoutStart?: () => void;
}) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    onLogoutStart?.();

    await fetch("/api/auth", {
      method: "DELETE",
    });

    router.refresh();
    router.push("/");
  }

  return (
    <button type="button" onClick={handleLogout}>
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}