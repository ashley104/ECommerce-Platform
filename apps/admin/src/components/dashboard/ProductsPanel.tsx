import { Edit, Trash2 } from "lucide-react";
import type { Product } from "@repo/db/data";

type ProductsPanelProps = {
  products: Product[];
};

export default function ProductsPanel({ products }: ProductsPanelProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="bg-slate-200 text-xs font-semibold uppercase tracking-normal text-slate-500">
            <tr>
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3 text-right">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.length === 0 ? (
              <tr>
                <td className="px-5 py-10 text-center text-slate-500" colSpan={6}>
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-950">{product.name}</p>
                        <p className="mt-1 max-w-md truncate text-slate-500">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-950">
                    {`$${product.price}`}
                  </td>
                  <td className="px-5 py-4">
                    {product.stock}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ${
                        product.active
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                          : "bg-slate-100 text-slate-600 ring-slate-200"
                      }`}
                    >
                      {product.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        disabled
                        className="rounded-md p-2 text-indigo-500"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        disabled
                        className="rounded-md p-2 text-rose-500"
                        aria-label={`Delete ${product.name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
