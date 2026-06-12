import React from 'react';
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { perfumes } from "../lib/data";

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-24 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-serif mb-6 tracking-tight text-gray-900 leading-tight">
          Fragrance to tell <br /> your story.
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto font-light text-sm md:text-base leading-relaxed uppercase tracking-widest">
          The Premier Collection from Western Visayas
        </p>
        <div className="mt-10 h-[1px] w-20 bg-black mx-auto"></div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {perfumes.map((perfume) => (
            <ProductCard 
              key={perfume.id} 
              name={perfume.name}
              price={perfume.price}
              scentFamily={perfume.scentFamily}
              image={perfume.image}
              hoverImage={perfume.hoverImage}
            />
          ))}
        </div>
      </section>
    </main>
  );
}