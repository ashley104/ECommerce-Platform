"use client";

import { useCart } from "@/components/Product/CartContext";
import { useState } from "react";

export default function CheckoutButton() {
  const { items } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    const response = await fetch("/api/checkout", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    window.location.href = data.url;
  };

  if (isLoading) {
    return (
      <button disabled className="inline-flex h-11 w-full items-center justify-center rounded-md bg-gray-400 px-5 text-sm font-semibold text-white">
        Processing...
      </button>
    );
  } 
  else {
    return (
      <button onClick={handleCheckout} className="inline-flex h-11 w-full items-center justify-center rounded-md bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-slate-800">
        Proceed to checkout
      </button>
    );
  }
}