"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProductStockStatus, products, type Product } from "../lib/data";

export interface InventoryCheckoutItem {
  code: string;
  quantity: number;
}

export interface InventoryActionResult {
  ok: boolean;
  message: string;
}

export interface InventoryMovement {
  id: string;
  code: string;
  productName: string;
  quantity: number;
  type: "checkout-deduction" | "manual-add" | "manual-subtract";
  reason: string;
  orderId?: string;
  createdAt: string;
}

interface InventoryContextValue {
  hasHydrated: boolean;
  stockByCode: Record<string, number>;
  movements: InventoryMovement[];
  getProductStock: (code: string) => number;
  getProductWithInventory: (product: Product) => Product;
  deductStockForCheckout: (items: InventoryCheckoutItem[], orderId: string) => InventoryActionResult;
  manualAddStock: (code: string, quantity: number, reason?: string) => InventoryActionResult;
  manualSubtractStock: (code: string, quantity: number, reason?: string) => InventoryActionResult;
  resetPrototypeInventory: () => void;
}

const INVENTORY_STORAGE_KEY = "scent-of-visayas-inventory-v1";
const INVENTORY_MOVEMENTS_STORAGE_KEY = "scent-of-visayas-inventory-movements-v1";

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

const createInitialStockMap = () =>
  products.reduce<Record<string, number>>((stockMap, product) => {
    stockMap[product.code] = product.stock;
    return stockMap;
  }, {});

const sanitizeStockMap = (storedStockMap: Record<string, number>) => {
  const initialStockMap = createInitialStockMap();

  return products.reduce<Record<string, number>>((stockMap, product) => {
    const storedStock = storedStockMap[product.code];

    stockMap[product.code] =
      typeof storedStock === "number" && Number.isFinite(storedStock) && storedStock >= 0
        ? Math.floor(storedStock)
        : initialStockMap[product.code];

    return stockMap;
  }, {});
};

const getProductByCode = (code: string) => products.find((product) => product.code === code);

const createMovementId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [stockByCode, setStockByCode] = useState<Record<string, number>>(createInitialStockMap);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedStock = window.localStorage.getItem(INVENTORY_STORAGE_KEY);
      const storedMovements = window.localStorage.getItem(INVENTORY_MOVEMENTS_STORAGE_KEY);

      if (storedStock) {
        const parsedStock = JSON.parse(storedStock) as Record<string, number>;
        setStockByCode(sanitizeStockMap(parsedStock));
      } else {
        setStockByCode(createInitialStockMap());
      }

      if (storedMovements) {
        setMovements(JSON.parse(storedMovements) as InventoryMovement[]);
      }
    } catch {
      setStockByCode(createInitialStockMap());
      setMovements([]);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(stockByCode));
  }, [stockByCode, hasHydrated]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(INVENTORY_MOVEMENTS_STORAGE_KEY, JSON.stringify(movements));
  }, [movements, hasHydrated]);

  const getProductStock = useCallback(
    (code: string) => {
      const originalProduct = getProductByCode(code);

      if (!originalProduct) {
        return 0;
      }

      return stockByCode[code] ?? originalProduct.stock;
    },
    [stockByCode],
  );

  const getProductWithInventory = useCallback(
    (product: Product): Product => {
      const currentStock = getProductStock(product.code);

      return {
        ...product,
        stock: currentStock,
        stockStatus: getProductStockStatus(currentStock),
        isAvailable: currentStock > 0,
      };
    },
    [getProductStock],
  );

  const deductStockForCheckout = useCallback(
    (items: InventoryCheckoutItem[], orderId: string): InventoryActionResult => {
      for (const item of items) {
        const currentStock = getProductStock(item.code);

        if (item.quantity > currentStock) {
          const product = getProductByCode(item.code);

          return {
            ok: false,
            message: `${product?.name ?? item.code} only has ${currentStock} item${currentStock === 1 ? "" : "s"} left.`,
          };
        }
      }

      const createdAt = new Date().toISOString();

      setStockByCode((currentStockMap) => {
        const nextStockMap = { ...currentStockMap };

        items.forEach((item) => {
          const currentStock = nextStockMap[item.code] ?? getProductStock(item.code);
          nextStockMap[item.code] = Math.max(0, currentStock - item.quantity);
        });

        return nextStockMap;
      });

      const newMovements: InventoryMovement[] = items.map((item) => {
        const product = getProductByCode(item.code);

        return {
          id: createMovementId(),
          code: item.code,
          productName: product?.name ?? item.code,
          quantity: item.quantity,
          type: "checkout-deduction",
          reason: "Automatic deduction after customer checkout",
          orderId,
          createdAt,
        };
      });

      setMovements((currentMovements) => [...newMovements, ...currentMovements]);

      return {
        ok: true,
        message: "Inventory deducted",
      };
    },
    [getProductStock],
  );

  const manualAddStock = useCallback((code: string, quantity: number, reason = "Manual admin stock add") => {
    const product = getProductByCode(code);
    const safeQuantity = Math.floor(quantity);

    if (!product) {
      return {
        ok: false,
        message: "Product not found.",
      };
    }

    if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) {
      return {
        ok: false,
        message: "Enter a valid quantity.",
      };
    }

    const createdAt = new Date().toISOString();

    setStockByCode((currentStockMap) => ({
      ...currentStockMap,
      [code]: (currentStockMap[code] ?? product.stock) + safeQuantity,
    }));

    setMovements((currentMovements) => [
      {
        id: createMovementId(),
        code,
        productName: product.name,
        quantity: safeQuantity,
        type: "manual-add",
        reason,
        createdAt,
      },
      ...currentMovements,
    ]);

    return {
      ok: true,
      message: `${safeQuantity} stock added to ${product.name}.`,
    };
  }, []);

  const manualSubtractStock = useCallback(
    (code: string, quantity: number, reason = "Manual admin stock subtract / physical sale") => {
      const product = getProductByCode(code);
      const safeQuantity = Math.floor(quantity);

      if (!product) {
        return {
          ok: false,
          message: "Product not found.",
        };
      }

      if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) {
        return {
          ok: false,
          message: "Enter a valid quantity.",
        };
      }

      const currentStock = getProductStock(code);

      if (safeQuantity > currentStock) {
        return {
          ok: false,
          message: `Only ${currentStock} stock available.`,
        };
      }

      const createdAt = new Date().toISOString();

      setStockByCode((currentStockMap) => ({
        ...currentStockMap,
        [code]: Math.max(0, (currentStockMap[code] ?? product.stock) - safeQuantity),
      }));

      setMovements((currentMovements) => [
        {
          id: createMovementId(),
          code,
          productName: product.name,
          quantity: safeQuantity,
          type: "manual-subtract",
          reason,
          createdAt,
        },
        ...currentMovements,
      ]);

      return {
        ok: true,
        message: `${safeQuantity} stock subtracted from ${product.name}.`,
      };
    },
    [getProductStock],
  );

  const resetPrototypeInventory = () => {
    setStockByCode(createInitialStockMap());
    setMovements([]);
    window.localStorage.removeItem(INVENTORY_STORAGE_KEY);
    window.localStorage.removeItem(INVENTORY_MOVEMENTS_STORAGE_KEY);
  };

  const value = useMemo<InventoryContextValue>(
    () => ({
      hasHydrated,
      stockByCode,
      movements,
      getProductStock,
      getProductWithInventory,
      deductStockForCheckout,
      manualAddStock,
      manualSubtractStock,
      resetPrototypeInventory,
    }),
    [
      hasHydrated,
      stockByCode,
      movements,
      getProductStock,
      getProductWithInventory,
      deductStockForCheckout,
      manualAddStock,
      manualSubtractStock,
    ],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error("useInventory must be used inside InventoryProvider");
  }

  return context;
}