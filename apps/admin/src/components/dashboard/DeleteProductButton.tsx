"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

type DeleteProductButtonProps = {
  productId: number;
  productName: string;
};

export default function DeleteProductButton({ productId, productName }: DeleteProductButtonProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) {
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        window.alert(data.error || "Failed to delete product");
        return;
      }

      router.push("/dashboard?tab=products");
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      window.alert("Failed to delete product");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-md p-2 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-rose-300"
      aria-label={`Delete ${productName}`}
    >
      <Trash2 className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
