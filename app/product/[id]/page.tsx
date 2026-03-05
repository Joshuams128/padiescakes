'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { products, dietaryAddons } from '@/lib/products';
import { useCart } from '@/context/CartContext';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const product = products.find((p) => p.id === params.id);
  const { addItem } = useCart();

  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!product) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Mock images for gallery (in real app, these would come from product data)
  // const images = [1, 2, 3, 4];

  const maxFlavorCount = product.maxFlavors || 1;

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) => {
      if (prev.includes(flavor)) {
        return prev.filter((f) => f !== flavor);
      } else {
        if (prev.length < maxFlavorCount) {
          return [...prev, flavor];
        }
        return prev;
      }
    });
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const calculateTotalPrice = () => {
    let total = product.basePrice * quantity;
    selectedAddons.forEach((addonId) => {
      const addon = dietaryAddons.find((a) => a.id === addonId);
      if (addon) total += addon.price * quantity;
    });
    return total;
  };

  const handleAddToCart = () => {
    if (selectedFlavors.length === 0) return;

    const itemPrice = calculateTotalPrice() / quantity; // Price per item including addons

    addItem({
      id: `${product.id}-${selectedFlavors.sort().join('-')}-${selectedAddons.sort().join('-')}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      flavor: selectedFlavors.join(', '),
      dietaryOptions: selectedAddons,
      quantity: quantity,
      price: itemPrice,
      image: product.image,
      notes: notes || undefined,
    });

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset selections
    setSelectedFlavors([]);
    setSelectedAddons([]);
    setNotes('');
    setQuantity(1);
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-primary-600">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <Image 
                src={product.image}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-xl text-gray-600 mb-6">{product.description}</p>

            {/* Price */}
            <div className="mb-8">
              <span className="text-3xl font-bold text-primary-600">
                ${calculateTotalPrice().toFixed(2)}
              </span>
              <span className="text-gray-500 ml-2">
                (Base: ${product.basePrice})
              </span>
            </div>

            {/* Flavor Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Select Flavor{maxFlavorCount > 1 && `(s) - Choose up to ${maxFlavorCount}`} <span className="text-red-500">*</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.flavors.map((flavor) => (
                  <button
                    key={flavor}
                    onClick={() => toggleFlavor(flavor)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                      selectedFlavors.includes(flavor)
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-400'
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
              {maxFlavorCount > 1 && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedFlavors.length}/{maxFlavorCount} selected
                </p>
              )}
            </div>

            {/* Size Selection (if applicable) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {product.sizes[0].name} - {product.sizes[0].pieces} pieces
                      </p>
                      <p className="text-sm text-gray-600">
                        {product.sizes[0].serves}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-primary-600">
                      ${product.sizes[0].price}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dietary Add-ons */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Dietary Options (Optional)
              </h3>
              <div className="space-y-3">
                {dietaryAddons.map((addon) => (
                  <label
                    key={addon.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAddons.includes(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-3 text-gray-900 font-medium">
                        {addon.name}
                      </span>
                    </div>
                    <span className="text-primary-600 font-semibold">
                      +${addon.price}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes Field */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Special Instructions (Optional)
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special requests, dietary restrictions, or custom messages..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-400 focus:outline-none resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Maximum 500 characters
              </p>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-xl transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="relative">
              {showSuccess && (
                <div className="absolute -top-16 left-0 right-0 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg text-center font-semibold">
                  ✓ Added to cart!
                </div>
              )}
              <button
                onClick={handleAddToCart}
                disabled={selectedFlavors.length === 0}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                  selectedFlavors.length > 0
                    ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {selectedFlavors.length > 0
                  ? 'Add to Cart'
                  : `Please Select ${maxFlavorCount > 1 ? `up to ${maxFlavorCount}` : 'a'} Flavor`}
              </button>
              <button
                onClick={() => router.push('/cart')}
                className="w-full mt-3 py-4 rounded-lg font-bold text-lg bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 transition-all"
              >
                View Cart
              </button>
            </div>

            {/* Product Features */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Handcrafted with premium ingredients</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Same-day delivery available</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Customization options available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">You May Also Like</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {products
              .filter((p) => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 group-hover:shadow-xl">
                    <div className="relative aspect-square bg-gradient-to-br from-primary-200 to-secondary-200">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-semibold text-sm px-4 text-center">
                        {relatedProduct.name}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-bold text-primary-600">
                        ${relatedProduct.basePrice}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
