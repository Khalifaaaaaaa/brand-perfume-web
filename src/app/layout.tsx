import type { Metadata } from "next";
import React from "react";
import { CartProvider } from "../components/CartProvider";
import { InventoryProvider } from "../components/InventoryProvider";
import Navbar from "../components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scent of Visayas",
  description: "A minimalist perfume storefront inspired by the elegance of Visayas fragrances.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-950 antialiased">
        <InventoryProvider>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </InventoryProvider>
      </body>
    </html>
  );
}