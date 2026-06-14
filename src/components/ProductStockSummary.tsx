"use client";

import React from "react";
import type { Product } from "../lib/data";
import { useInventory } from "./InventoryProvider";

interface ProductStockSummaryProps {
  product: Product;
}

const formatStockStatus = (stockStatus: Product["stockStatus"]) => {
  if (stockStatus === "out-of-stock") {
    return "Out of Stock";
  }

  if (stockStatus === "low-stock") {
    return "Low Stock";
  }

  return "In Stock";
};

export default function ProductStockSummary({ product }: ProductStockSummaryProps) {
  const { getProductWithInventory } = useInventory();
  const productWithInventory = getProductWithInventory(product);

  return (
    <div className="mt-8 grid gap-3 border-y border-neutral-950/10 py-6 sm:grid-cols-2">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">Available Stock</p>
        <p className="mt-2 text-sm text-neutral-700">
          {productWithInventory.stock} {productWithInventory.unit}
        </p>
      </div>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">Scent Family</p>
        <p className="mt-2 text-sm text-neutral-700">{productWithInventory.scentFamily}</p>
      </div>

      <div className="sm:col-span-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">Prototype Status</p>
        <p className="mt-2 text-sm text-neutral-700">{formatStockStatus(productWithInventory.stockStatus)}</p>
      </div>
    </div>
  );
}