"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Product } from "@repo/db/data";

//products in cart with quantity, picking only necessary fields from Product type
export type CartItem = Pick<
  Product,
  "id" | "name" | "category" | "imageUrl" | "price" | "stock"
> & {
  quantity: number;
};

//value provided by CartContext
type CartContextValue = {
  items: CartItem[];
  itemCount: number; // total quantity of all items in the cart
  subtotal: number; // total price of all items in the cart
  
  addProduct: (product: Product) => void;
  incrementProduct: (productId: number) => void;
  decrementProduct: (productId: number) => void;
  removeProduct: (productId: number) => void;
  getQuantity: (productId: number) => number; //get quantity of a specific product in the cart
};

//create cart context
const CartContext = createContext<CartContextValue | null>(null);

// localStorage key
const CART_STORAGE_KEY = "cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  //cart items state
  const [items, setItems] = useState<CartItem[]>([]);

  // load cart from localStorage when app starts
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (storedCart) {
      setItems(JSON.parse(storedCart)); //convert json string back to array of cart items and set it to state
    }
  }, []);

  // save cart whenever items change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  //add product to cart
  const addProduct = (product: Product) => {
    setItems((currentItems) => {
      //check if product is already in cart
      const existingItem = currentItems.find((item) => item.id === product.id);
      
      //if not, add new item with quantity 1
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

      //if it is, increment quantity but not above stock
      if (existingItem.quantity >= product.stock) {
        return currentItems;
      }

      return currentItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    });
  };

  const incrementProduct = (productId: number) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== productId || item.quantity >= item.stock) {
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      }),
    );
  };

  const decrementProduct = (productId: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeProduct = (productId: number) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== productId));
  };

  //total quantity of all items in the cart
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  //total price of all items in the cart
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getQuantity = (productId: number) => {
    const item = items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addProduct,
        incrementProduct,
        decrementProduct,
        removeProduct,
        getQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

//custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
