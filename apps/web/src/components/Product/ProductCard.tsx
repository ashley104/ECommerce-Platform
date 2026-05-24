"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";

import type { Product } from "@repo/db/data";

type ProductCardProps = {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({ product, quantityInCart, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock === 0;
  const [isAdding, setIsAdding] = useState(false);
  const reachedStockLimit = quantityInCart >= product.stock && product.stock > 0;

  function handleAddToCart() {
    if (isOutOfStock || reachedStockLimit) {
      return;
    }

    setIsAdding(true);
    onAddToCart(product);
    window.setTimeout(() => setIsAdding(false), 900);
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3">
          <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {product.category}
          </span>
        </div>

        <h3 className="line-clamp-1 text-base font-semibold text-slate-950">{product.name}</h3>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {product.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-xl font-semibold tracking-normal text-slate-950">
              ${product.price}
            </p>
            <p
              className={`mt-1 text-xs font-medium ${
                isOutOfStock ? "text-rose-600" : "text-slate-500"
              }`}
            >
              {isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding || reachedStockLimit}
            className={`inline-flex cursor-pointer h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold transition ${
              isOutOfStock || reachedStockLimit
                ? "cursor-not-allowed bg-slate-100 text-slate-400"
                : isAdding
                  ? "bg-emerald-600 text-white"
                  : quantityInCart > 0
                    ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                Added
              </>
            ) : reachedStockLimit ? (
              <>Max reached</>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                {quantityInCart > 0 ? "Add More" : "Add"}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
