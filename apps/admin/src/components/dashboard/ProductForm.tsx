/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

import { validateProduct } from "@/lib/validations/product";
import type { Product } from "@repo/db/data";

type ProductFormProps = {
  mode: "create" | "edit";
  initialFields: Product;
};

export default function ProductForm({ mode, initialFields }: ProductFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, setIsPending] = useState(false);
  const [submitError, setSubmitError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setSubmitError("");

    // Collect form data
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    // Client-side validation
    const validationErrors = validateProduct({
      name,
      category,
      description,
      imageUrl,
      price,
      stock,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: initialFields.id || undefined,
          name,
          category,
          description,
          imageUrl,
          price,
          stock,
          active: formData.get("active") === "on",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setSubmitError(data.error || "An error occurred while saving the product.");
        }
        return;
      }

      router.push("/dashboard?tab=products");
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
      setSubmitError("Unable to save this product. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {submitError ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {submitError}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-800" htmlFor="name">
            Product name
          </label>
          <input
            id="name"
            name="name"
            defaultValue={initialFields.name}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.name ? <p className="mt-1 text-sm text-rose-600">{errors.name}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            defaultValue={initialFields.category}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.category ? <p className="mt-1 text-sm text-rose-600">{errors.category}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="imageUrl">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            defaultValue={initialFields.imageUrl}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.imageUrl ? <p className="mt-1 text-sm text-rose-600">{errors.imageUrl}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="price">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initialFields.price}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.price ? <p className="mt-1 text-sm text-rose-600">{errors.price}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="stock">
            Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            defaultValue={initialFields.stock}
            className="mt-2 h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.stock ? <p className="mt-1 text-sm text-rose-600">{errors.stock}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-800" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={initialFields.description}
            className="mt-2 w-full rounded-md border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
          {errors.description ? <p className="mt-1 text-sm text-rose-600">{errors.description}</p> : null}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initialFields.active}
          className="h-4 w-4 rounded border-slate-300 text-slate-950"
        />
        Visible in storefront
      </label>

      {initialFields.imageUrl ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          <img src={initialFields.imageUrl} alt="" className="max-h-72 w-full object-cover" />
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Link
          href="/dashboard?tab=products"
          className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-10 items-center justify-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
