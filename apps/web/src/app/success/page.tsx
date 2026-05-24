"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/Product/CartContext";
import { useSession } from "next-auth/react";

export default  function SuccessPage() {
  const router = useRouter();
  const { status } = useSession();
    
  const { items, clearCart, subtotal } = useCart();

  // prevent duplicate API calls
  const hasCreatedOrder = useRef(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    // stop if already ran
    if (hasCreatedOrder.current) {
      return;
    }

    hasCreatedOrder.current = true;

    const createOrder = async () => {
      try {
        const payload = {
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),

          subtotal,
          total: subtotal,

          paymentProvider: "STRIPE",
          status: "PAID",
        };

        await fetch("/api/orders", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        });

        clearCart();
      } catch (error) {
        console.error(error);
      }
    };

    createOrder();
  }, [items, subtotal, clearCart, router, status]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-semibold mb-4">
        Payment Successful
      </h1>

      <p className="mb-6">
        Thank you for your purchase.
      </p>

      <Link
        href="/"
        className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
      >
        Back to Home
      </Link>
    </div>
  );
}