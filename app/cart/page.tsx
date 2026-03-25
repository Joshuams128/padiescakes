'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { dietaryAddons, products, cakeFillings } from '@/lib/products';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="py-12 md:py-16">
        <div className="container-custom text-center px-4 md:px-6">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <svg
                className="w-20 md:w-24 h-20 md:h-24 mx-auto text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Add some delicious treats to get started!
            </p>
            <Link href="/shop" className="btn-primary inline-block">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container-custom px-4 md:px-6">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => {
                const dietaryNames = item.dietaryOptions
                  .map((id) => dietaryAddons.find((a) => a.id === id)?.name)
                  .filter(Boolean);
                const product = products.find((p) => p.id === item.productId);
                const sizeName = item.size !== undefined && product?.sizes ? product.sizes[item.size]?.name : null;
                const fillingName = item.filling ? cakeFillings.find((f) => f.id === item.filling)?.name : null;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg flex-shrink-0 relative mx-auto md:mx-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          <span className="font-semibold">Flavor:</span> {item.flavor}
                        </p>
                        {sizeName && (
                          <p>
                            <span className="font-semibold">Size:</span> {sizeName}
                          </p>
                        )}
                        {fillingName && (
                          <p>
                            <span className="font-semibold">Filling:</span> {fillingName}
                          </p>
                        )}
                        {item.color && (
                          <p>
                            <span className="font-semibold">Colour:</span> {item.color}
                          </p>
                        )}
                        {dietaryNames.length > 0 && (
                          <p>
                            <span className="font-semibold">Dietary Options:</span>{' '}
                            {dietaryNames.join(', ')}
                          </p>
                        )}
                        {item.notes && (
                          <p>
                            <span className="font-semibold">Special Instructions:</span>{' '}
                            {item.notes}
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <Link
                          href={`/product/${item.productId}?edit=${encodeURIComponent(item.id)}`}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center md:text-right md:flex-shrink-0">
                      <p className="text-xl font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 md:sticky md:top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Order Items List */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                {items.map((item) => {
                  const dietaryNames = item.dietaryOptions
                    .map((id) => dietaryAddons.find((a) => a.id === id)?.name)
                    .filter(Boolean);
                  const product = products.find((p) => p.id === item.productId);
                  const sizeName = item.size !== undefined && product?.sizes ? product.sizes[item.size]?.name : null;
                  const fillingName = item.filling ? cakeFillings.find((f) => f.id === item.filling)?.name : null;

                  return (
                    <div key={item.id} className="flex gap-3">
                      {/* Product Image */}
                      <div className="w-14 h-14 bg-gray-100 rounded flex-shrink-0 relative">
                        <Image 
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 text-sm">
                        <p className="font-semibold text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-600">Flavor: {item.flavor}</p>
                        {sizeName && (
                          <p className="text-xs text-gray-600">Size: {sizeName}</p>
                        )}
                        {fillingName && (
                          <p className="text-xs text-gray-600">Filling: {fillingName}</p>
                        )}
                        {item.color && (
                          <p className="text-xs text-gray-600">Colour: {item.color}</p>
                        )}
                        {dietaryNames.length > 0 && (
                          <p className="text-xs text-gray-600">{dietaryNames.join(', ')}</p>
                        )}
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        <p className="font-semibold text-gray-900 mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Pickup</span>
                  <span className="text-sm font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-sm">Additional charge applies</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Subtotal</span>
                  <span className="text-gray-900">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full btn-primary py-4 text-lg font-bold mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/shop"
                className="block w-full text-center py-3 text-gray-900 font-semibold hover:text-gray-700"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Pickup, local delivery and GTA area</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
