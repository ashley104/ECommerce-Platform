import Link from "next/link";

import ProductForm from "./ProductForm";
import type { Product } from "@repo/db/data";

type ProductFormPageProps = {
  mode: "create" | "edit";
  initialFields: Product;
};

export default function ProductFormPage({ mode, initialFields }: ProductFormPageProps) {
  const title = mode === "create" ? "Add Product" : "Edit Product";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/dashboard?tab=products"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-blue-500 transition hover:bg-slate-100"
          >
            Back
          </Link>
          <h1 className="text-3xl font-bold text-indigo-500">{title}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductForm mode={mode} initialFields={initialFields} />
      </div>
    </main>
  );
}
