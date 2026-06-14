import React from "react";
import AdminSecretTrigger from "../components/AdminSecretTrigger";
import ProductCard from "../components/ProductCard";
import { perfumes } from "../lib/data";

export default function Home() {
  return (
    <main className="bg-white text-neutral-950">
      <AdminSecretTrigger />

      <section className="mx-auto flex min-h-[380px] max-w-5xl flex-col items-center justify-center px-6 pb-20 pt-24 text-center md:min-h-[430px]">
        <h1 className="max-w-3xl font-serif text-4xl leading-[0.95] tracking-[-0.04em] text-neutral-950 sm:text-5xl md:text-6xl">
          Fragrance to tell
          <br />
          your story.
        </h1>

        <p className="mt-9 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-xs">
          The Premier Collection from Western Visayas
        </p>

        <div className="mt-12 h-px w-20 bg-neutral-950" />
      </section>

      <section id="shop" className="mx-auto max-w-7xl scroll-mt-36 px-6 pb-28 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-x-12 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
          {perfumes.map((perfume) => (
            <ProductCard key={perfume.code} {...perfume} />
          ))}
        </div>
      </section>
    </main>
  );
}