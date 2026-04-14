'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { dietaryAddons, products, cakeFillings } from '@/lib/products';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    fulfillment: 'pickup' as 'pickup' | 'delivery',
    deliveryAddress: '',
    dateNeeded: '',
    specialNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    return (
      <div className="py-12 md:py-16">
        <div className="container-custom text-center px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Add some items before checking out.
          </p>
          <Link href="/shop" className="btn-primary inline-block">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (formData.fulfillment === 'delivery' && !formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    if (!formData.dateNeeded) {
      newErrors.dateNeeded = 'Date needed is required';
    } else {
      const hasCake = items.some(
        (item) => products.find((p) => p.id === item.productId)?.category === 'cakes'
      );
      const hasOther = items.some(
        (item) => products.find((p) => p.id === item.productId)?.category !== 'cakes'
      );
      const selectedDate = new Date(formData.dateNeeded);

      const minCakeDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      minCakeDate.setHours(0, 0, 0, 0);
      const minOtherDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      minOtherDate.setHours(0, 0, 0, 0);

      const cakeFails = hasCake && selectedDate < minCakeDate;
      const otherFails = hasOther && selectedDate < minOtherDate;

      if (cakeFails && otherFails) {
        newErrors.dateNeeded = 'Date must be at least 3 days from today (1 week for cakes)';
      } else if (cakeFails) {
        newErrors.dateNeeded = 'Your date works for other items but cakes require at least 1 week from today';
      } else if (otherFails) {
        newErrors.dateNeeded = 'Date must be at least 3 days from today';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        fulfillment: formData.fulfillment,
        address: formData.fulfillment === 'delivery' ? formData.deliveryAddress : 'Pickup',
        dateNeeded: formData.dateNeeded,
        notes: formData.specialNotes,
        items: items.map(item => {
          const product = products.find(p => p.id === item.productId);
          const sizeName = item.size !== undefined && product?.sizes ? product.sizes[item.size]?.name : null;
          const fillingName = item.filling ? cakeFillings.find(f => f.id === item.filling)?.name : null;
          return {
            name: item.name,
            flavor: item.flavor,
            color: item.color,
            size: sizeName,
            filling: fillingName,
            dietaryOptions: item.dietaryOptions,
            notes: item.notes,
            quantity: item.quantity,
            price: item.price
          };
        }),
        total: getTotalPrice()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(`Failed to submit order: ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      const orderTotal = getTotalPrice();
      clearCart();
      router.push(`/success?orderNumber=${data.orderNumber}&total=${orderTotal}`);
    } catch (error) {
      console.error('Order submission error:', error);
      alert('There was an error submitting your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = getTotalPrice();

  return (
    <div className="py-8 md:py-12">
      <div className="container-custom px-4 md:px-6">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 md:p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Contact & Order Information
              </h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.name
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 focus:border-gray-400'
                    }`}
                    placeholder="John Smith"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.email
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 focus:border-gray-400'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 focus:border-gray-400'
                    }`}
                    placeholder="(123) 456-7890"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Fulfillment Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Fulfillment Method <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label
                      className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.fulfillment === 'pickup'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value="pickup"
                        checked={formData.fulfillment === 'pickup'}
                        onChange={handleChange}
                        className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                      />
                      <span className="font-semibold text-gray-900">Pickup</span>
                    </label>
                    <label
                      className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.fulfillment === 'delivery'
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fulfillment"
                        value="delivery"
                        checked={formData.fulfillment === 'delivery'}
                        onChange={handleChange}
                        className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-500"
                      />
                      <span className="font-semibold text-gray-900">Delivery</span>
                    </label>
                  </div>

                  {/* Pickup Info */}
                  {formData.fulfillment === 'pickup' && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        You will receive the pickup location details via email after your order is confirmed.
                      </p>
                    </div>
                  )}

                  {/* Delivery Address */}
                  {formData.fulfillment === 'delivery' && (
                    <div className="mt-3">
                      <label htmlFor="deliveryAddress" className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Address (GTA) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="deliveryAddress"
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                          errors.deliveryAddress
                            ? 'border-red-500 focus:border-red-600'
                            : 'border-gray-200 focus:border-gray-400'
                        }`}
                        placeholder="123 Main St, City, Durham Region, Postal Code"
                      />
                      {errors.deliveryAddress && (
                        <p className="mt-1 text-sm text-red-600">{errors.deliveryAddress}</p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Delivery within the GTA. Additional charges will apply.
                      </p>
                    </div>
                  )}
                </div>

                {/* Date Needed */}
                <div>
                  <label htmlFor="dateNeeded" className="block text-sm font-semibold text-gray-700 mb-2">
                    Date Needed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateNeeded"
                    name="dateNeeded"
                    value={formData.dateNeeded}
                    onChange={handleChange}
                    min={new Date(Date.now() + (items.some((item) => products.find((p) => p.id === item.productId)?.category === 'cakes') ? 7 : 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.dateNeeded
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-gray-200 focus:border-gray-400'
                    }`}
                  />
                  {errors.dateNeeded && (
                    <p className="mt-1 text-sm text-red-600">{errors.dateNeeded}</p>
                  )}
                  {(() => {
                    const hasCake = items.some(
                      (item) => products.find((p) => p.id === item.productId)?.category === 'cakes'
                    );
                    const hasOther = items.some(
                      (item) => products.find((p) => p.id === item.productId)?.category !== 'cakes'
                    );
                    if (hasCake && hasOther) {
                      return (
                        <p className="mt-1 text-sm text-gray-500">
                          Cakes must be ordered at least <strong>1 week</strong> in advance. All other items require at least <strong>3 days</strong>.
                        </p>
                      );
                    }
                    if (hasCake) {
                      return <p className="mt-1 text-sm text-gray-500">Cake orders must be placed at least 1 week in advance.</p>;
                    }
                    return <p className="mt-1 text-sm text-gray-500">Orders must be placed at least 3 days in advance.</p>;
                  })()}
                </div>

                {/* Special Notes */}
                <div>
                  <label htmlFor="specialNotes" className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Notes (Optional)
                  </label>
                  <textarea
                    id="specialNotes"
                    name="specialNotes"
                    value={formData.specialNotes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:outline-none resize-none"
                    placeholder="Any special requests, allergies, or custom messages..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 text-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting Order...' : 'Place Order'}
                </button>
                <p className="mt-4 text-sm text-gray-600 text-center">
                  By placing your order, you agree to our terms and conditions
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 md:sticky md:top-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const dietaryNames = item.dietaryOptions
                    .map((id) => dietaryAddons.find((a) => a.id === id)?.name)
                    .filter(Boolean);
                  const product = products.find((p) => p.id === item.productId);
                  const sizeName = item.size !== undefined && product?.sizes ? product.sizes[item.size]?.name : null;
                  const fillingName = item.filling ? cakeFillings.find((f) => f.id === item.filling)?.name : null;

                  return (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-200">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded flex-shrink-0 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
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
                        <p className="text-xs text-gray-600 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Pickup</span>
                  <span className="text-sm font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-sm">Additional charge applies</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-gray-900">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Payment:</strong> We'll contact you via email with payment instructions after your order is confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
