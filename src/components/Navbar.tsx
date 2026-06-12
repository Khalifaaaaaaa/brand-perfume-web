"use client";
import React from 'react';
import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100 pt-8 pb-4 px-6 md:px-10">
      <div className="flex justify-center mb-6">
        <Link href="/" className="text-2xl md:text-3xl font-serif tracking-[0.25em] uppercase text-black">
          Scent of Visayas
        </Link>
      </div>

      <div className="max-w-7xl mx-auto flex justify-between items-center relative">
        <div className="flex-1 hidden md:block">
          <Search size={18} className="cursor-pointer hover:opacity-50 transition-opacity" />
        </div>

        <ul className="flex gap-6 md:gap-10 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-800">
          <li className="hover:text-gray-400 transition-colors cursor-pointer">Shop</li>
          <li className="hover:text-gray-400 transition-colors cursor-pointer">Best Sellers</li>
          <li className="hover:text-gray-400 transition-colors cursor-pointer">Discovery</li>
          <li className="hover:text-gray-400 transition-colors cursor-pointer">About</li>
        </ul>

        <div className="flex-1 flex justify-end gap-5 items-center">
          <div className="relative cursor-pointer hover:opacity-50 transition-opacity">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 stroke-[1.5px]" />
          </div>
          <Menu size={20} className="md:hidden cursor-pointer" />
        </div>
      </div>
    </nav>
  );
}