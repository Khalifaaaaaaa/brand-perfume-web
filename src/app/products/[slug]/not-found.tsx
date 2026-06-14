import Link from "next/link";
import React from "react";

export default function ProductNotFound() {
  return (
    <main className="bg-white px-6 py-24 text-neutral-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Product Not Found</p>

        <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] text-neutral-950 sm:text-5xl md:text-6xl">
          This fragrance is no longer on this shelf.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
          The product link may be incomplete, outdated, or not part of the current Excel-based product collection.
        </p>

        <div className="mx-auto mt-12 h-px w-20 bg-neutral-950" />

        <Link
          href="/#shop"
          className="mt-12 inline-flex items-center justify-center border border-neutral-950 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-950 transition duration-300 hover:bg-neutral-950 hover:text-white"
        >
          Return to Shop
        </Link>
      </section>
    </main>
  );
}