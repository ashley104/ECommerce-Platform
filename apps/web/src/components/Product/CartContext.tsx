"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Product } from "@repo/db/data";

export type CartItem = Pick<
  Product,
  "id" | "name" | "category" | "imageUrl" | "price" | "stock"
> & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  getQuantity: (productId: number) => number;
  addProduct: (product: Product) => void;
  incrementProduct: (productId: number) => void;
  decrementProduct: (productId: number) => void;
  removeProduct: (productId: number) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "ecommerce-platform-cart-v1";
const CartContext = createContext<CartContextValue | undefined>(undefined);

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as CartItem[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item) => {
      return (
        typeof item?.id === "number" &&
        typeof item?.name === "string" &&
        typeof item?.category === "string" &&
        typeof item?.imageUrl === "string" &&
        typeof item?.price === "number" &&
        typeof item?.stock === "number" &&
        typeof item?.quantity === "number" &&
        item.quantity > 0
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, isHydrated]);

  const getQuantity = useCallback(
    (productId: number) => items.find((item) => item.id === productId)?.quantity ?? 0,
    [items],
  );

  const addProduct = useCallback((product: Product) => {
    if (product.stock <= 0) {
      return;
    }

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (!existingItem) {
        return [
          ...currentItems,
          {
            id: product.id,
            name: product.name,
            category: product.category,
            imageUrl: product.imageUrl,
            price: Number(product.price),
            stock: product.stock,
            quantity: 1,
          },
        ];
      }

      if (existingItem.quantity >= product.stock) {
        return currentItems;
      }

      return currentItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  }, []);

  const incrementProduct = useCallback((productId: number) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId || item.quantity >= item.stock) {
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      }),
    );
  }, []);

  const decrementProduct = useCallback((productId: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeProduct = useCallback((productId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      getQuantity,
      addProduct,
      incrementProduct,
      decrementProduct,
      removeProduct,
      clearCart,
    };
  }, [items, getQuantity, addProduct, incrementProduct, decrementProduct, removeProduct, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
