import React from "react";

const brandValues = [
  "Minimal presentation",
  "Fragrance-led storytelling",
  "Everyday elegance",
  "Visayas-inspired identity",
];

export default function AboutPage() {
  return (
    <main className="bg-white px-6 py-24 text-neutral-950 sm:px-8 lg:px-10">
      <section className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="order-2 lg:order-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">About the House</p>

          <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] text-neutral-950 sm:text-5xl md:text-6xl">
            Scented stories,
            <br />
            rooted in Visayas.
          </h1>

          <div className="mt-10 h-px w-20 bg-neutral-950" />

          <p className="mt-10 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
            Scent of Visayas is a perfume storefront shaped around quiet luxury, clean presentation, and personal
            fragrance discovery. The site is being built to feel refined and editorial, allowing each scent to stand
            clearly without visual noise.
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
            This temporary About copy can later be replaced with the owner’s real story, brand origin, product
            philosophy, customer promise, and a final owner image. The visual direction should remain soft, spacious,
            and premium.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {brandValues.map((value) => (
              <div key={value} className="border border-neutral-950/10 px-5 py-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-neutral-950/10 bg-neutral-50">
            <div className="absolute inset-8 border border-neutral-950/10" />

            <div className="relative text-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-400">Owner Image</p>
              <p className="mt-3 text-sm text-neutral-400">Elegant portrait placeholder</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl border-t border-neutral-950/10 pt-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">Collection</p>
            <p className="mt-4 text-sm leading-7 text-neutral-500">
              A growing catalog built from the uploaded Excel inventory, with final fragrance details to be refined as
              official product descriptions become available.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">Experience</p>
            <p className="mt-4 text-sm leading-7 text-neutral-500">
              Designed for simple browsing, clear product discovery, and a smooth checkout experience once the cart and
              order system are added.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">Next Step</p>
            <p className="mt-4 text-sm leading-7 text-neutral-500">
              Replace this placeholder content with final brand copy, owner photo, contact details, and any store
              policies before launch.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}