'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [total, setTotal] = useState('0.00');

  useEffect(() => {
    const orderNum = searchParams.get('orderNumber');
    const orderTotal = searchParams.get('total');

    if (!orderNum || !orderTotal) {
      // Redirect to home if no order data
      router.push('/');
      return;
    }

    setOrderNumber(orderNum);
    setTotal(parseFloat(orderTotal).toFixed(2));
  }, [searchParams, router]);

  if (!orderNumber) {
    return null; // Or a loading state
  }

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Received!</h1>
            <p className="text-xl text-gray-600">
              Thank you for your order. We can't wait to make your treats! 🎉
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <div className="border-b pb-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Order #{orderNumber}
              </h2>
              <p className="text-gray-600">
                A confirmation email has been sent to your inbox with all the details.
              </p>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 border-l-4 border-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Payment
              </h3>

              <div className="space-y-4">
                <p className="text-3xl font-bold text-gray-900">
                  ${total}
                </p>
                <p className="text-gray-700">
                  We'll contact you via email with payment instructions for your order.
                </p>
              </div>
            </div>

            {/* What's Next */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">We'll Contact You</p>
                    <p className="text-sm text-gray-600">
                      Our team will reach out within 24 hours to confirm your order details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Payment Instructions</p>
                    <p className="text-sm text-gray-600">
                      We'll send you payment instructions via email.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">We Create Magic</p>
                    <p className="text-sm text-gray-600">
                      Our bakers will handcraft your order with love and premium ingredients.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Delivery Day</p>
                    <p className="text-sm text-gray-600">
                      Your delicious treats will be delivered fresh on your requested date!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="btn-primary text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Back to Home
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-2">Questions about your order?</p>
            <Link
              href="/contact"
              className="text-gray-900 font-semibold hover:text-gray-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="py-16">
        <div className="container-custom text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
