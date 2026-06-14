import React from "react";
import ProductGrid from "../../components/ProductGrid";
import PublicPageIntro from "../../components/PublicPageIntro";
import { getBestSellerSeedProducts } from "../../lib/data";

export default function BestSellersPage() {
  const bestSellerProducts = getBestSellerSeedProducts(12);

  return (
    <main className="bg-white text-neutral-950">
      <section className="mx-auto max-w-7xl px-6 pb-28 pt-24 sm:px-8 lg:px-10">
        <PublicPageIntro
          eyebrow="Curated Collection"
          title="Best Sellers"
          description={
            <>
              A polished selection of fragrances presented as the current best-seller showcase. Since the POS sales
              system is not built yet, this page temporarily ranks products using the product data fallback logic from
              the Excel inventory.
            </>
          }
        />

        <div className="mx-auto mt-14 max-w-3xl border border-neutral-950/10 px-6 py-6 text-center sm:px-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">
            Temporary Ranking Logic
          </p>
          <p className="mt-4 text-sm leading-7 text-neutral-500">
            Future version: real POS sales count. Current version: placeholder sales count first, then higher available
            stock as fallback.
          </p>
        </div>

        <ProductGrid products={bestSellerProducts} className="mt-16" />
      </section>
    </main>
  );
}