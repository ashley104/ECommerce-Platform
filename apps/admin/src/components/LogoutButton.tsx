"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const router = useRouter();
  const [loadLogout, setLoadLogout] = useState(false);
  return (
    <button
        onClick={async () => {
          setLoadLogout(true);
          await signOut({ redirect: false });
          router.push("/login");
        }}
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-neutral-700 px-3 py-2 text-sm font-semibold text-neutral-50 cursor-pointer"
      >
        {loadLogout ? "Logging out..." : "Logout"}
      </button>
  );
}