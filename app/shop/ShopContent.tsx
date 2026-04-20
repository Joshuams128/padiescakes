'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import type { Product } from '@/lib/products';

interface Category {
  id: string;
  name: string;
}

export default function ShopContent({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || 'all';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (categoryId !== 'all') {
      params.set('category', categoryId);
    }
    router.replace(`/shop${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Shop Our Desserts</h1>
          <p className="text-xl text-gray-600">
            Handcrafted treats for every occasion
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-400'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-max">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group relative"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <Link href={`/product/${product.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 group-hover:shadow-xl flex flex-col h-full">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-white flex-shrink-0">
                    <div className="absolute inset-3">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.basePrice}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.category.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* View item button (desktop hover only) */}
              {hoveredProduct === product.id && (
                <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
                  <Link
                    href={`/product/${product.id}`}
                    className="pointer-events-auto bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all transform scale-105"
                  >
                    View item
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
