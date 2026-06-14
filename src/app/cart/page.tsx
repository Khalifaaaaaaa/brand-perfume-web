"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../../components/CartProvider";

const formatCurrency = (value: number) => `₱${value.toLocaleString("en-PH")}`;

export default function CartPage() {
  const {
    items,
    totalItems,
    subtotal,
    hasHydrated,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    setQuantity,
    clearCart,
  } = useCart();

  const [cartNotice, setCartNotice] = useState("");

  const showNotice = (message: string) => {
    setCartNotice(message);

    window.setTimeout(() => {
      setCartNotice("");
    }, 1800);
  };

  const handleIncrease = (code: string) => {
    const result = increaseQuantity(code);

    if (!result.ok) {
      showNotice(result.message);
    }
  };

  if (!hasHydrated) {
    return (
      <main className="min-h-[calc(100vh-116px)] bg-white px-6 py-24 text-neutral-950 sm:px-8 lg:px-10">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Loading Cart</p>
          <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl md:text-6xl">
            Preparing your selection.
          </h1>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-116px)] bg-white px-6 py-20 text-neutral-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="grid gap-8 border-b border-neutral-950/10 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Your Selection</p>

            <h1 className="mt-6 font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl md:text-6xl">
              Cart
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
              Review your selected fragrances. Cart data is saved locally in this browser for prototype testing.
            </p>
          </div>

          <div className="text-left lg:text-right">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">Cart Total</p>
            <p className="mt-3 font-serif text-3xl tracking-[-0.03em]">{formatCurrency(subtotal)}</p>
          </div>
        </header>

        {cartNotice ? (
          <div className="mt-8 border border-neutral-950/10 bg-neutral-50 px-5 py-4 text-sm text-neutral-600">
            {cartNotice}
          </div>
        ) : null}

        {items.length === 0 ? (
          <section className="mx-auto max-w-3xl py-24 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-neutral-950/10">
              <ShoppingBag size={26} strokeWidth={1.4} />
            </div>

            <h2 className="mt-8 font-serif text-3xl tracking-[-0.04em] text-neutral-950">Your cart is empty.</h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-500">
              Add a fragrance from the collection before proceeding to checkout.
            </p>

            <Link
              href="/#shop"
              className="mt-10 inline-flex items-center justify-center border border-neutral-950 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-950 transition duration-300 hover:bg-neutral-950 hover:text-white"
            >
              Return to Shop
            </Link>
          </section>
        ) : (
          <section className="grid gap-12 py-12 lg:grid-cols-[1fr_380px]">
            <div className="space-y-6">
              {items.map((item) => {
                const itemSubtotal = item.priceValue * item.quantity;
                const quantityLimitReached = item.quantity >= item.stock;

                return (
                  <article
                    key={item.code}
                    className="grid gap-6 border border-neutral-950/10 p-5 sm:grid-cols-[140px_1fr] sm:p-6"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative aspect-[3/4] overflow-hidden bg-neutral-50"
                      aria-label={`View ${item.name}`}
                    >
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="140px" />
                    </Link>

                    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400">
                          <span>{item.code}</span>
                          <span className="h-px w-5 bg-neutral-300" />
                          <span>{item.scentFamily}</span>
                        </div>

                        <h2 className="mt-4 font-serif text-2xl leading-tight tracking-[-0.03em] text-neutral-950">
                          <Link href={`/products/${item.slug}`} className="transition duration-300 hover:opacity-70">
                            {item.name}
                          </Link>
                        </h2>

                        <p className="mt-3 text-sm font-medium text-neutral-950">{formatCurrency(item.priceValue)}</p>

                        <p className="mt-3 text-xs leading-6 text-neutral-400">Available stock: {item.stock} PC</p>
                      </div>

                      <div className="flex flex-col items-start gap-5 lg:items-end">
                        <div className="flex items-center border border-neutral-950/10">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.name} quantity`}
                            onClick={() => decreaseQuantity(item.code)}
                            className="flex h-11 w-11 items-center justify-center text-neutral-500 transition duration-300 hover:bg-neutral-100 hover:text-neutral-950"
                          >
                            <Minus size={15} strokeWidth={1.5} />
                          </button>

                          <input
                            aria-label={`${item.name} quantity`}
                            type="number"
                            min={1}
                            max={item.stock}
                            value={item.quantity}
                            onChange={(event) => {
                              const nextQuantity = Number(event.target.value);
                              const result = setQuantity(item.code, nextQuantity);

                              if (!result.ok) {
                                showNotice(result.message);
                              }
                            }}
                            className="h-11 w-16 border-x border-neutral-950/10 text-center text-sm outline-none"
                          />

                          <button
                            type="button"
                            aria-label={`Increase ${item.name} quantity`}
                            disabled={quantityLimitReached}
                            onClick={() => handleIncrease(item.code)}
                            className="flex h-11 w-11 items-center justify-center text-neutral-500 transition duration-300 hover:bg-neutral-100 hover:text-neutral-950 disabled:cursor-not-allowed disabled:text-neutral-300"
                          >
                            <Plus size={15} strokeWidth={1.5} />
                          </button>
                        </div>

                        <p className="text-sm font-medium text-neutral-950">{formatCurrency(itemSubtotal)}</p>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.code)}
                          className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-neutral-400 transition duration-300 hover:text-neutral-950"
                        >
                          <Trash2 size={14} strokeWidth={1.5} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit border border-neutral-950/10 p-6 lg:sticky lg:top-36">
              <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">Order Summary</p>

              <div className="mt-8 space-y-5 border-b border-neutral-950/10 pb-6 text-sm text-neutral-500">
                <div className="flex items-center justify-between gap-4">
                  <span>Items</span>
                  <span className="text-neutral-950">{totalItems}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="text-neutral-950">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span>Shipping</span>
                  <span className="text-neutral-400">Set during checkout</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500">Grand Total</span>
                <span className="font-serif text-2xl tracking-[-0.03em]">{formatCurrency(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                className="mt-8 flex w-full items-center justify-center bg-neutral-950 px-8 py-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white transition duration-300 hover:bg-neutral-800"
              >
                Proceed to Checkout
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="mt-4 w-full border border-neutral-950/10 px-8 py-4 text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-500 transition duration-300 hover:border-neutral-950 hover:text-neutral-950"
              >
                Clear Cart
              </button>

              <p className="mt-6 text-xs leading-6 text-neutral-400">
                Prototype note: cart data is stored only in this browser through localStorage. Real checkout, order
                saving, inventory deduction, and receipt upload need a backend before public launch.
              </p>
            </aside>
          </section>
        )}
      </section>
    </main>
  );
}