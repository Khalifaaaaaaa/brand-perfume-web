"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";

const navLinks = [
  { label: "Shop", href: "/#shop", activePath: "/" },
  { label: "Best Sellers", href: "/best-sellers", activePath: "/best-sellers" },
  { label: "Discovery", href: "/discovery", activePath: "/discovery" },
  { label: "About", href: "/about", activePath: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, hasHydrated } = useCart();

  const getIsActive = (activePath: string) => {
    if (activePath === "/") {
      return pathname === "/" || pathname === "/shop";
    }

    return pathname === activePath;
  };

  const linkClassName = (isActive: boolean) =>
    `relative text-[10px] font-medium uppercase tracking-[0.32em] transition-colors duration-300 ${
      isActive
        ? "text-neutral-950 after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:bg-neutral-950"
        : "text-neutral-500 hover:text-neutral-950"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-950/5 bg-white/95 backdrop-blur-sm">
      <div className="relative mx-auto flex min-h-[116px] max-w-7xl flex-col items-center justify-center px-6 py-6">
        <div className="flex w-full items-center justify-between md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2 md:px-8 lg:px-10">
          <Link
            href="/search"
            aria-label="Open search page"
            className="hidden rounded-full p-2 text-neutral-900 transition duration-300 hover:bg-neutral-100 md:inline-flex"
          >
            <Search size={20} strokeWidth={1.7} />
          </Link>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((currentState) => !currentState)}
            className="rounded-full p-2 text-neutral-900 transition duration-300 hover:bg-neutral-100 md:hidden"
          >
            {isMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          <Link
            href="/"
            className="text-center font-serif text-xl uppercase tracking-[0.42em] text-neutral-950 transition-opacity duration-300 hover:opacity-70 sm:text-2xl md:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            Scent of Visayas
          </Link>

          <div className="flex items-center gap-1 md:ml-auto">
            <Link
              href="/search"
              aria-label="Open search page"
              className="rounded-full p-2 text-neutral-900 transition duration-300 hover:bg-neutral-100 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              <Search size={19} strokeWidth={1.7} />
            </Link>

            <Link
              href="/cart"
              aria-label={`Open cart page${totalItems > 0 ? ` with ${totalItems} items` : ""}`}
              className="relative rounded-full p-2 text-neutral-900 transition duration-300 hover:bg-neutral-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={20} strokeWidth={1.7} />

              {hasHydrated && totalItems > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-950 px-1.5 text-[10px] font-medium leading-none text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="hidden text-center font-serif text-3xl uppercase tracking-[0.45em] text-neutral-950 transition-opacity duration-300 hover:opacity-70 md:block lg:text-4xl"
        >
          Scent of Visayas
        </Link>

        <nav aria-label="Primary navigation" className="mt-7 hidden md:block">
          <ul className="flex items-center justify-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClassName(getIsActive(link.activePath))}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {isMenuOpen ? (
        <nav aria-label="Mobile navigation" className="border-t border-neutral-950/5 bg-white px-6 py-5 md:hidden">
          <ul className="mx-auto flex max-w-sm flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block border-b border-neutral-950/5 py-4 text-center text-[11px] font-medium uppercase tracking-[0.32em] transition-colors duration-300 ${
                    getIsActive(link.activePath) ? "text-neutral-950" : "text-neutral-500 hover:text-neutral-950"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}