'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function StickyMobileCartButton() {
  const { getTotalItems } = useCart();
  const router = useRouter();
  const cartItemCount = getTotalItems();

  return (
    <div className="md:hidden fixed bottom-4 right-4 z-40">
      <button 
        onClick={() => router.push('/cart')}
        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-6 rounded-full shadow-lg flex items-center gap-2 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>Cart</span>
        {cartItemCount > 0 && (
          <span className="bg-white text-primary-600 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {cartItemCount}
          </span>
        )}
      </button>
    </div>
  );
}
