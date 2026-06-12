"use client";
import React from 'react';
import { motion } from "framer-motion";
import Image from "next/image";

interface ProductCardProps {
  name: string;
  price: string;
  scentFamily: string;
  image: string;
  hoverImage: string;
}

export default function ProductCard({ name, price, scentFamily, image, hoverImage }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="group cursor-pointer flex flex-col items-center"
    >
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#f7f7f7] mb-6">
        <div className="relative w-full h-full">
          {/* Splash Art - Visible on Hover */}
          <Image 
            src={hoverImage} 
            alt={`${name} mood`}
            fill 
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out scale-105 group-hover:scale-100"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          
          {/* Formal Bottle - Visible by Default */}
          <Image 
            src={image} 
            alt={name} 
            fill 
            className="object-cover opacity-100 group-hover:opacity-0 transition-opacity duration-700 ease-in-out"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        
        <button className="absolute bottom-0 left-0 right-0 bg-black text-white py-4 text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
          Add to Bag
        </button>
      </div>

      <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400 mb-2">{scentFamily}</span>
      <h3 className="text-sm font-light tracking-wide text-gray-900 mb-1 uppercase text-center">{name}</h3>
      <p className="text-sm font-medium text-gray-600">₱{price}</p>
    </motion.div>
  );
}