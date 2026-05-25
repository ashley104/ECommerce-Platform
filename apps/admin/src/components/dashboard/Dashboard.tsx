import Link from "next/link";
import type { ReactNode } from "react";

import LogoutButton from "../LogoutButton";
import Overview from "./Overview";

type DashboardProps = {
  activeTab: "products" | "orders";
  actions?: ReactNode;
  children: ReactNode;
  products: any[];
  totalOrders: number;
};

const tabs = [
  { href: "/dashboard?tab=products", label: "Products", value: "products" },
  { href: "/dashboard?tab=orders", label: "Orders", value: "orders" },
] as const;

export default function Dashboard({ activeTab, actions, children, products, totalOrders }: DashboardProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-blue-700">Admin Dashboard</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {actions}
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 lg:flex-row lg:items-end lg:justify-between">
          <Overview
            totalProducts={products.length}
            totalOrders={totalOrders}
          />

          <nav
            className="inline-flex w-full rounded-md border border-slate-200 bg-white p-1 shadow-sm sm:w-auto"
            aria-label="Dashboard sections"
          >
            {tabs.map((tab) => {
              const selected = activeTab === tab.value;

              return (
                <Link
                  key={tab.value}
                  href={tab.href}
                  className={`inline-flex flex-1 items-center justify-center gap-2 rounded px-4 py-2 text-sm font-semibold transition sm:flex-none ${
                    selected
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {children}
      </div>
    </main>
  );
}
