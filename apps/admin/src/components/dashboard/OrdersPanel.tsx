/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { CalendarDaysIcon, CreditCardIcon } from "@heroicons/react/24/outline";

type Item = {
  id: number;
  productId?: number | null;
  product?: { id: number; name: string; imageUrl: string } | null;
  productName?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice: number;
};

type Order = {
  id: string;
  userId?: string | null;
  userEmail?: string | null;
  status: string;
  createdAt: string | null;
  paidAt?: string | null;
  paymentProvider?: string;
  total: number;
  items: Item[];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function statusClassName(status: string) {
  if (status === "PAID") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }

  if (status === "CANCELLED" || status === "REFUNDED") {
    return "bg-rose-50 text-rose-700 ring-rose-200";
  }

  return "bg-amber-50 text-amber-700 ring-amber-200";
}

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchOrders() {
      try {
        const res = await fetch("/api/purchase");
        if (!res.ok) throw new Error('Failed to fetch');
        const data: Order[] = await res.json();
        if (mounted) {
          setOrders(data);
        }
      } catch (e) {
        if (mounted) setOrders([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading && orders === null) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-950">Purchase records</h3>
          <p className="mt-1 text-sm text-slate-500">Track recent orders and the products purchased.</p>
        </div>
        <div className="px-5 py-10 text-center text-sm text-slate-500">Loading...</div>
      </section>
    );
  }

  const safeOrders = orders ?? [];

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-base font-semibold text-slate-950">Purchase records</h3>
        <p className="mt-1 text-sm text-slate-500">Track recent orders and the products purchased.</p>
      </div>

      <div className="divide-y divide-slate-100">
        {safeOrders.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">No purchase records yet.</p>
        ) : (
          safeOrders.map((order) => (
            <article key={order.id} className="px-5 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-950">Order #{order.id.slice(0, 8)}</h4>
                    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${statusClassName(order.status)}`}>
                      {order.status.toLowerCase()}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDaysIcon className="h-4 w-4" aria-hidden="true" />
                      {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <strong className="sr-only">Customer:</strong>
                      {order.userEmail ?? order.userId ?? "Unknown user"}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CreditCardIcon className="h-4 w-4" aria-hidden="true" />
                      {order.paymentProvider}
                    </span>
                  </div>
                </div>

                <div className="text-left lg:text-right">
                  <p className="text-sm text-slate-500">Order total</p>
                  <p className="mt-1 text-xl font-semibold text-slate-950">
                    {currencyFormatter.format(Number(order.total))}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3"
                  >
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                      {item.product?.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.product.imageUrl} alt={item.product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-slate-400">No image</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-950">{item.product?.name ?? item.productName}</p>
                      <p className="mt-0.5 text-xs text-slate-500">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-950">
                      {currencyFormatter.format(Number(item.totalPrice))}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
