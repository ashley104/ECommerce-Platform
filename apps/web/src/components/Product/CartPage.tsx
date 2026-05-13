"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "./CartContext";

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal: total,
    incrementProduct,
    decrementProduct,
    removeProduct
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mt-5 text-2xl font-semibold text-slate-950">Your cart is empty</h1>
          <Link
            href="/"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 mb-8"
      >
        Continue shopping
      </Link>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <section className="flex-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-800">
                Shopping cart
              </p>
              <h1 className="mt-1 text-3xl font-semibold text-indigo-700">Review your items</h1>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {items.map((item) => {
              const lineTotal = item.price * item.quantity;
              const maxQuantityReached = item.quantity >= item.stock;

              return (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-28 w-full rounded-lg object-cover sm:h-32 sm:w-32"
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {item.category}
                      </span>
                      <h2 className="mt-3 text-lg font-semibold text-slate-950">{item.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {currencyFormatter.format(item.price)} each
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.stock} available in stock
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => decrementProduct(item.id)}
                          className="inline-flex h-10 w-10 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <span className="min-w-12 px-4 text-center text-sm font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => incrementProduct(item.id)}
                          disabled={maxQuantityReached}
                          className="inline-flex h-10 w-10 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-500">Total</p>
                        <p className="text-lg font-semibold text-slate-950">
                          {currencyFormatter.format(lineTotal)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeProduct(item.id)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:w-[360px]">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-indigo-800">
            Order summary
          </p>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <div className="flex items-center justify-between">
              <span>Items</span>
              <span className="font-semibold text-slate-950">{itemCount}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base">
              <span className="font-semibold text-indigo-700">Total</span>
              <span className="font-semibold text-indigo-700">{currencyFormatter.format(total)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              href="/home/checkout"
              className="inline-flex h-11 w-full items-center justify-center rounded-md bg-indigo-500 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Proceed to checkout
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
