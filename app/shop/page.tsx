'use client';

import { useState } from 'react';
import Link from 'next/link';
import { products, categories } from '@/lib/products';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Shop Our Collection</h1>
          <p className="text-xl text-gray-600">
            Handcrafted treats for every occasion
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-400'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link href={`/product/${product.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-primary-200 to-secondary-200">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-semibold">
                      {product.name}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-600">
                        ${product.basePrice}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.category.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Quick Add Button (shown on hover) */}
              {hoveredProduct === product.id && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Link
                    href={`/product/${product.id}`}
                    className="pointer-events-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all transform scale-105"
                  >
                    Quick Add
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No Products Message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
