"use client";

import React, { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import ProductGrid from "./ProductGrid";
import { products, searchProducts } from "../lib/data";

const suggestedSearches = ["Bombshell", "Vanilla", "Citrus", "Men", "Floral", "SOV-001"];

export default function SearchClient() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim();

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return products;
    }

    return searchProducts(normalizedQuery);
  }, [normalizedQuery]);

  const resultMessage = normalizedQuery
    ? `${results.length} result${results.length === 1 ? "" : "s"} for “${normalizedQuery}”`
    : `Showing all ${products.length} fragrances`;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-28 pt-24 text-neutral-950 sm:px-8 lg:px-10">
      <header className="mx-auto max-w-4xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Find Your Fragrance</p>

        <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] text-neutral-950 sm:text-5xl md:text-6xl">
          Search the collection.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
          Search by product name, product code, scent family, category, description, ingredients, or fragrance notes.
        </p>

        <div className="mx-auto mt-12 h-px w-20 bg-neutral-950" />
      </header>

      <div className="mx-auto mt-14 max-w-3xl">
        <label htmlFor="site-search" className="sr-only">
          Search products
        </label>

        <div className="flex items-center gap-4 border-b border-neutral-950/20 pb-4 transition-colors duration-300 focus-within:border-neutral-950">
          <Search size={21} strokeWidth={1.5} className="shrink-0 text-neutral-400" />

          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Bombshell, SOV-001, citrus, floral..."
            className="w-full bg-transparent text-base text-neutral-950 outline-none placeholder:text-neutral-400"
          />

          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="rounded-full p-2 text-neutral-400 transition duration-300 hover:bg-neutral-100 hover:text-neutral-950"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {suggestedSearches.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="border border-neutral-950/10 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-500 transition duration-300 hover:border-neutral-950 hover:text-neutral-950"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-14 flex items-center justify-between border-y border-neutral-950/10 py-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">{resultMessage}</p>
      </div>

      <ProductGrid
        products={results}
        className="mt-14"
        emptyTitle="No matching fragrance"
        emptyDescription="Try searching by a simpler word like vanilla, citrus, men, floral, or a product code such as SOV-001."
      />
    </section>
  );
}