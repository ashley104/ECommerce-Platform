"use client";

import { History, ShoppingCart } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useCart } from "./Product/CartContext";
import { useState } from "react";

export default function HeaderButtons() {
  const { itemCount } = useCart();
  const router = useRouter();
  const [loadLogout, setLoadLogout] = useState(false);
  const [loadCart, setLoadCart] = useState(false);

  const handleCartClick = () => {
    setLoadCart(true);
    router.push("/cart");
  };

  return (
    <div className="cursor-pointer inline-flex items-center gap-2">
      <button
        onClick={() => router.push("/purchase-history")}
        className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
      >
        <History className="h-5 w-5" />
        History
      </button>
      <button 
        onClick={handleCartClick}
        className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-blue-700">
        <ShoppingCart className="w-5 h-5"/>
        {loadCart ? "Loading..." : "Cart"}
        <span className="rounded bg-blue-700 px-2 py-0.5 text-xs text-white">{itemCount}</span>
      </button>
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
    </div>
  )
}