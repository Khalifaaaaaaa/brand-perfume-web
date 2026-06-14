import React from "react";
import ProductCard from "./ProductCard";
import type { Product } from "../lib/data";

interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

export default function ProductGrid({
  products,
  emptyTitle = "No fragrances found",
  emptyDescription = "Try a different search term or browse the full collection.",
  className = "",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className={`mx-auto max-w-2xl border border-neutral-950/10 px-6 py-12 text-center ${className}`}>
        <p className="font-serif text-2xl tracking-[-0.03em] text-neutral-950">{emptyTitle}</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-neutral-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-x-12 gap-y-20 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.code} {...product} />
      ))}
    </div>
  );
}