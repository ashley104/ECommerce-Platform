import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, DollarSign, Package } from "lucide-react";
import { getServerSession } from "next-auth/next";

import { client } from "@repo/db/client";
import { getOrdersByUser } from "@repo/db/orders";

import { authOptions } from "@/lib/auth";

const currencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

const dateFormatter = new Intl.DateTimeFormat("en-AU", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});

export default async function PurchaseHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await client.db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const orders = [...(await getOrdersByUser(user.id))]
    .filter((order) => order.status === "PAID")
    .sort(
    (leftOrder, rightOrder) => rightOrder.createdAt.getTime() - leftOrder.createdAt.getTime(),
    );

  if (orders.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Package className="mx-auto mb-4 h-16 w-16 text-slate-300" aria-hidden="true" />
          <h1 className="text-2xl font-semibold text-slate-950">No purchase history</h1>
          <p className="mt-2 text-sm text-slate-600">Your completed orders will appear here.</p>
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
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-3xl font-semibold text-indigo-800">Purchase history</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Review past orders, item counts, and totals for your storefront purchases.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Continue shopping
        </Link>
      </div>

      <div className="mt-8 space-y-6">
        {orders.map((order) => {
          const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
          const displayDate = order.paidAt ?? order.createdAt;
          const isPaid = order.status === "PAID";

          return (
            <article
              key={order.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <header className="border-b border-slate-200 bg-slate-50 px-6 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-slate-500" aria-hidden="true" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Order date</p>
                        <p className="font-medium text-slate-950">{dateFormatter.format(displayDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-slate-500" aria-hidden="true" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Order ID</p>
                        <p className="font-medium text-slate-950">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-slate-500" aria-hidden="true" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">Total amount</p>
                        <p className="font-medium text-slate-950">
                          {currencyFormatter.format(Number(order.total))}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {order.status}
                  </div>
                </div>
              </header>

              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-950">Items ({totalItems})</h2>
                  <p className="text-sm text-slate-500">Payment via {order.paymentProvider}</p>
                </div>

                <div className="mt-5 space-y-4">
                  {order.items.map((item) => {
                    const productName = item.productName ?? item.product?.name ?? "Product";
                    const imageUrl = item.product?.imageUrl;

                    return (
                      <div
                        key={item.id}
                        className="flex flex-col gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={productName}
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                            <Package className="h-8 w-8" aria-hidden="true" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-semibold text-slate-950">{productName}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                            {item.product?.description ?? "Purchased item"}
                          </p>
                          <p className="mt-2 text-sm text-slate-500">Quantity: {item.quantity}</p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-base font-semibold text-slate-950">
                            {currencyFormatter.format(Number(item.totalPrice))}
                          </p>
                          <p className="text-sm text-slate-500">
                            {currencyFormatter.format(Number(item.unitPrice))} each
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}