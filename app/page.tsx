'use client';

import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/products';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#FDE8E8' }}>
        <div className="absolute inset-0" />
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Florals You Can Eat!

                <span className="text-gray-900"> Beautifully Crafted</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Handcrafted cupcake bouquets and custom cakes for every special occasion.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/shop" className="btn-primary">
                  Shop Now
                </Link>
                <Link href="/contact" className="bg-transparent hover:bg-gray-900/10 text-gray-900 font-semibold py-3 px-6 rounded-lg border-2 border-gray-900 transition-colors duration-200">
                  Custom Orders
                </Link>
              </div>
          </div>
        </div>
      </section>

      {/* Occasion CTAs */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Perfect for Every Occasion
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['7-cupcake-bouquet', 'heart-shaped-vintage-cake', '24-boxed-cupcakes'].map((productId) => {
              const product = products.find(p => p.id === productId);
              if (!product) return null;
              return (
                <Link key={product.id} href={`/product/${product.id}`} className="group">
                  <div className="relative h-64 rounded-lg overflow-hidden shadow-lg mb-4 bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      priority
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600">
                    {product.description.split('\n')[0]}
                  </p>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/shop" className="btn-primary inline-block">
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Product */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#FDE8E8' }}>
        <div className="absolute inset-0" />
        <div className="container-custom relative z-10">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Most Popular Choice
          </h2>
          {(() => {
            const featuredProduct = products.find(p => p.id === '19-cupcake-bouquet');
            if (!featuredProduct) return null;
            return (
              <div>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
                    <Image 
                      src={featuredProduct.image}
                      alt={featuredProduct.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-5xl font-bold text-gray-900 mb-4">
                      {featuredProduct.name}
                    </h2>
                    <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                      {featuredProduct.description}
                    </p>
                    <div className="mb-8">
                      <p className="text-3xl font-bold text-gray-900 mb-2">
                        ${featuredProduct.basePrice}
                      </p>
                      <p className="text-gray-600">Choose up to {featuredProduct.maxFlavors} flavors from our selection</p>
                    </div>
                    <Link href={`/product/${featuredProduct.id}`} className="bg-white text-gray-900 hover:bg-white/90 font-semibold text-lg px-8 py-3 rounded-lg transition-colors duration-200">
                      Order Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
