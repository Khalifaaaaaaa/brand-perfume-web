"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "../lib/data";

export interface CartItem {
  code: string;
  slug: string;
  name: string;
  price: string;
  priceValue: number;
  currency: "PHP";
  image: string;
  scentFamily: string;
  stock: number;
  quantity: number;
}

interface CartActionResult {
  ok: boolean;
  message: string;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  hasHydrated: boolean;
  addToCart: (product: Product, quantity?: number) => CartActionResult;
  removeFromCart: (code: string) => void;
  increaseQuantity: (code: string) => CartActionResult;
  decreaseQuantity: (code: string) => void;
  setQuantity: (code: string, quantity: number) => CartActionResult;
  clearCart: () => void;
  getItemQuantity: (code: string) => number;
}

const CART_STORAGE_KEY = "scent-of-visayas-cart-v1";

const CartContext = createContext<CartContextValue | undefined>(undefined);

const findProductByCode = (code: string) => products.find((product) => product.code === code);

const productToCartItem = (product: Product, quantity: number): CartItem => ({
  code: product.code,
  slug: product.slug,
  name: product.name,
  price: product.price,
  priceValue: product.priceValue,
  currency: product.currency,
  image: product.image,
  scentFamily: product.scentFamily,
  stock: product.stock,
  quantity,
});

const sanitizeCartItems = (storedItems: CartItem[]): CartItem[] => {
  return storedItems
    .map((storedItem) => {
      const currentProduct = findProductByCode(storedItem.code);

      if (!currentProduct || !currentProduct.isAvailable || currentProduct.stock <= 0) {
        return null;
      }

      const safeQuantity = Math.min(Math.max(1, storedItem.quantity), currentProduct.stock);

      return productToCartItem(currentProduct, safeQuantity);
    })
    .filter((item): item is CartItem => item !== null);
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart) as CartItem[];
        setItems(sanitizeCartItems(parsedCart));
      }
    } catch {
      setItems([]);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hasHydrated]);

  const addToCart = (product: Product, quantity = 1): CartActionResult => {
    if (!product.isAvailable || product.stock <= 0) {
      return {
        ok: false,
        message: "Out of stock",
      };
    }

    const safeQuantity = Math.max(1, quantity);

    let result: CartActionResult = {
      ok: true,
      message: "Added to bag",
    };

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.code === product.code);

      if (!existingItem) {
        const quantityToAdd = Math.min(safeQuantity, product.stock);

        if (quantityToAdd < safeQuantity) {
          result = {
            ok: false,
            message: `Only ${product.stock} available`,
          };
        }

        return [...currentItems, productToCartItem(product, quantityToAdd)];
      }

      const nextQuantity = existingItem.quantity + safeQuantity;

      if (nextQuantity > product.stock) {
        result = {
          ok: false,
          message: `Max stock reached`,
        };

        return currentItems.map((item) =>
          item.code === product.code ? { ...item, quantity: product.stock, stock: product.stock } : item,
        );
      }

      return currentItems.map((item) =>
        item.code === product.code ? { ...item, quantity: nextQuantity, stock: product.stock } : item,
      );
    });

    return result;
  };

  const removeFromCart = (code: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.code !== code));
  };

  const setQuantity = (code: string, quantity: number): CartActionResult => {
    const product = findProductByCode(code);

    if (!product || !product.isAvailable || product.stock <= 0) {
      removeFromCart(code);

      return {
        ok: false,
        message: "Product unavailable",
      };
    }

    const safeQuantity = Math.max(1, Math.floor(quantity));

    if (safeQuantity > product.stock) {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.code === code ? { ...item, quantity: product.stock, stock: product.stock } : item,
        ),
      );

      return {
        ok: false,
        message: "Max stock reached",
      };
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.code === code ? { ...item, quantity: safeQuantity, stock: product.stock } : item)),
    );

    return {
      ok: true,
      message: "Quantity updated",
    };
  };

  const increaseQuantity = (code: string): CartActionResult => {
    const currentItem = items.find((item) => item.code === code);

    if (!currentItem) {
      return {
        ok: false,
        message: "Item not found",
      };
    }

    return setQuantity(code, currentItem.quantity + 1);
  };

  const decreaseQuantity = (code: string) => {
    const currentItem = items.find((item) => item.code === code);

    if (!currentItem) {
      return;
    }

    if (currentItem.quantity <= 1) {
      removeFromCart(code);
      return;
    }

    setQuantity(code, currentItem.quantity - 1);
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemQuantity = (code: string) => {
    return items.find((item) => item.code === code)?.quantity ?? 0;
  };

  const totalItems = useMemo(() => items.reduce((total, item) => total + item.quantity, 0), [items]);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.priceValue * item.quantity, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    totalItems,
    subtotal,
    hasHydrated,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    setQuantity,
    clearCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}