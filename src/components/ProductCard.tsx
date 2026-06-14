"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "../lib/data";
import { useInventory } from "./InventoryProvider";

type ProductCardProps = Product;

const getStockLabel = (stockStatus?: Product["stockStatus"], stock?: number) => {
  if (stockStatus === "out-of-stock" || stock === 0) {
    return "Out of stock";
  }

  if (stockStatus === "low-stock") {
    return "Low stock";
  }

  return "In stock";
};

export default function ProductCard(product: ProductCardProps) {
  const { getProductWithInventory } = useInventory();
  const productWithInventory = getProductWithInventory(product);
  const { name, price, scentFamily, image, hoverImage, slug, code, stock, stockStatus } = productWithInventory;

  const productHref = slug ? `/products/${slug}` : "/#shop";
  const stockLabel = getStockLabel(stockStatus, stock);

  return (
    <article className="group text-center text-neutral-950">
      <div className="relative mb-8 aspect-[3/4] overflow-hidden bg-neutral-50">
        <Link href={productHref} aria-label={`View ${name}`} className="block h-full w-full">
          <motion.div
            className="absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            initial={false}
          >
            <Image
              src={hoverImage}
              alt={`${name} splash artwork`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          </motion.div>

          <motion.div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0" initial={false}>
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            />
          </motion.div>
        </Link>

        <AddToCartButton
          product={productWithInventory}
          label="Add to Bag"
          unavailableLabel="Unavailable"
          className="absolute inset-x-6 bottom-6 z-20 translate-y-4 bg-neutral-950 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.28em] text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed disabled:bg-neutral-950/50"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">
          {code ? <span>{code}</span> : null}
          {code ? <span className="h-px w-5 bg-neutral-300" /> : null}
          <span>{stockLabel}</span>
        </div>

        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500">{scentFamily}</p>

        <h3 className="font-serif text-2xl leading-tight tracking-[-0.03em] text-neutral-950 transition duration-300 group-hover:opacity-70">
          <Link href={productHref}>{name}</Link>
        </h3>

        <p className="text-sm font-medium text-neutral-950">₱{price}</p>
      </div>
    </article>
  );
}