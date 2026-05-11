"use client";

import Link from "next/link";

import { useCart } from "@/components/Product/CartContext";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function CheckoutRoute() {
  const { itemCount, subtotal } = useCart();
  const shippingEstimate = itemCount > 0 ? 12 : 0;
  const taxEstimate = subtotal * 0.08;
  const total = subtotal + shippingEstimate + taxEstimate;

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Checkout</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Checkout flow is ready for integration</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          The cart now persists across navigation and supports item removal. Connect this screen to your payment provider and order creation flow when you are ready.
        </p>

        <div className="mt-8 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Items</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{itemCount}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Subtotal</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">{currencyFormatter.format(subtotal)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Estimated total</p>
            <p className="mt-1 text-xl font-semibold text-slate-950">
              {currencyFormatter.format(total)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/home/cart"
            className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Back to cart
          </Link>
          <Link
            href="/home"
            className="inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
