"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Filter } from "lucide-react";

import { useCart } from "./CartContext";
import ProductCard from "./ProductCard";
import type { Product } from "@repo/db/data";

type StorefrontPageProps = {
  products: Product[];
  categories: string[];
};

export default function StorefrontPage({ products, categories }: StorefrontPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { addProduct, getQuantity, itemCount, subtotal } = useCart();

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span className="font-bold text-xl text-blue-800">B2C Store</span>

            <div className="cursor-pointer inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-blue-700">
              <Link href="/home/cart" className="inline-flex items-center gap-2">
                <ShoppingCart className="w-5 h-5"/>
                Cart
                <span className="rounded bg-blue-700 px-2 py-0.5 text-xs text-white">{itemCount}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-indigo-500">Products</h1>

          <div className="flex flex-col md:flex-row gap-3 mb-7 mt-7">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-500 w-12 h-12" />
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-11 w-full appearance-none rounded-md border border-slate-300 bg-white pl-2 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="text-lg font-semibold text-slate-950">No products found</p>
            <p className="mt-2 text-sm text-slate-500">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantityInCart={getQuantity(product.id)}
                onAddToCart={addProduct}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
