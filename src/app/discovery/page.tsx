import React from "react";
import ProductGrid from "../../components/ProductGrid";
import PublicPageIntro from "../../components/PublicPageIntro";
import { getDiscoverySeedProducts } from "../../lib/data";

export default function DiscoveryPage() {
  const discoveryProducts = getDiscoverySeedProducts(12);

  return (
    <main className="bg-white text-neutral-950">
      <section className="mx-auto max-w-7xl px-6 pb-28 pt-24 sm:px-8 lg:px-10">
        <PublicPageIntro
          eyebrow="Under-Discovered Fragrances"
          title="Discovery"
          description={
            <>
              A quieter shelf for fragrances that deserve more attention. Since real sales data is not available yet,
              this page temporarily highlights low-sales placeholders and lower-stock items from the Excel inventory.
            </>
          }
        />

        <div className="mx-auto mt-14 max-w-3xl border border-neutral-950/10 px-6 py-6 text-center sm:px-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">
            Temporary Discovery Logic
          </p>
          <p className="mt-4 text-sm leading-7 text-neutral-500">
            Future version: least-sold products from POS data. Current version: placeholder sales count first, then
            lower available stock as fallback.
          </p>
        </div>

        <ProductGrid products={discoveryProducts} className="mt-16" />
      </section>
    </main>
  );
}