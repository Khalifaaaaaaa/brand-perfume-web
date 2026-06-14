import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import AddToCartButton from "../../../components/AddToCartButton";
import ProductStockSummary from "../../../components/ProductStockSummary";
import { getProductBySlug, products } from "../../../lib/data";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const formatStockStatus = (stockStatus: string) => {
  if (stockStatus === "out-of-stock") {
    return "Out of Stock";
  }

  if (stockStatus === "low-stock") {
    return "Low Stock";
  }

  return "In Stock";
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Scent of Visayas",
    };
  }

  return {
    title: `${product.name} | Scent of Visayas`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const stockStatusLabel = formatStockStatus(product.stockStatus);

  return (
    <main className="bg-white text-neutral-950">
      <section className="mx-auto grid max-w-7xl gap-16 px-6 pb-28 pt-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pt-24">
        <div>
          <Link
            href="/#shop"
            className="mb-8 inline-flex text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400 transition duration-300 hover:text-neutral-950"
          >
            ← Back to Shop
          </Link>

          <div className="relative aspect-[4/5] overflow-hidden border border-neutral-950/10 bg-neutral-50">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover transition-transform duration-700 hover:scale-[1.02]"
              sizes="(min-width: 1024px) 52vw, 100vw"
            />
          </div>
        </div>

        <div className="lg:pt-14">
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">
            <span>{product.code}</span>
            <span className="h-px w-6 bg-neutral-300" />
            <span>{stockStatusLabel}</span>
          </div>

          <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] text-neutral-950 sm:text-5xl md:text-6xl">
            {product.name}
          </h1>

          <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-500">
            {product.category}
          </p>

          <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base">{product.subtext}</p>

          <div className="mt-10 h-px w-20 bg-neutral-950" />

          <p className="mt-10 font-serif text-3xl tracking-[-0.03em] text-neutral-950">₱{product.price}</p>

          {product.isPlaceholderPrice ? (
            <p className="mt-3 text-xs leading-6 text-neutral-400">
              Temporary placeholder price. Replace once official selling prices are finalized.
            </p>
          ) : null}

          <ProductStockSummary product={product} />

          <AddToCartButton
            product={product}
            showHelperText
            className="mt-8 w-full bg-neutral-950 px-8 py-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white transition duration-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-950/40 sm:w-auto"
          />

          <section className="mt-14 space-y-10">
            <div>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-500">Description</h2>
              <p className="mt-4 text-sm leading-7 text-neutral-500 sm:text-base">{product.description}</p>
            </div>

            <div>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-500">Fragrance Notes</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {product.notes.map((note) => (
                  <span
                    key={note}
                    className="border border-neutral-950/10 px-4 py-3 text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-500"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-500">Ingredients</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-500">
                {product.ingredients.map((ingredient) => (
                  <li key={ingredient} className="border-b border-neutral-950/5 pb-3">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-500">Specifications</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-500">
                {product.specifications.map((specification) => (
                  <li key={specification} className="border-b border-neutral-950/5 pb-3">
                    {specification}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}