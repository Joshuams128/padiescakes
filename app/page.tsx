import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Sweet Moments,
                <span className="text-primary-600"> Beautifully Crafted</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Handcrafted cupcake bouquets and custom cakes for every special occasion.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop" className="btn-primary">
                  Shop Now
                </Link>
                <Link href="/contact" className="btn-secondary">
                  Custom Orders
                </Link>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-2xl font-bold">
                Hero Image
              </div>
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
            {/* Wedding */}
            <Link href="/shop?occasion=wedding" className="group">
              <div className="relative h-64 rounded-lg overflow-hidden shadow-lg mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition-transform duration-300">
                  Wedding
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Weddings</h3>
              <p className="text-gray-600">
                Elegant bouquets and cakes to make your special day unforgettable.
              </p>
            </Link>

            {/* Birthday */}
            <Link href="/shop?occasion=birthday" className="group">
              <div className="relative h-64 rounded-lg overflow-hidden shadow-lg mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-yellow-400 flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition-transform duration-300">
                  Birthday
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Birthdays</h3>
              <p className="text-gray-600">
                Celebrate with colorful, delicious treats that bring joy to any age.
              </p>
            </Link>

            {/* Corporate */}
            <Link href="/shop?occasion=corporate" className="group">
              <div className="relative h-64 rounded-lg overflow-hidden shadow-lg mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-400 flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition-transform duration-300">
                  Corporate
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Corporate Events</h3>
              <p className="text-gray-600">
                Impress clients and colleagues with professional, stunning presentations.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Size Guide */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Bouquet Size Guide
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose the perfect size for your event. All bouquets feature our handcrafted cupcakes
            arranged beautifully.
          </p>
          <div className="grid md:grid-cols-4 gap-6">
            {/* 7 Bouquet */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">7</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Small Bouquet</h3>
              <p className="text-gray-600 mb-4">Perfect for intimate gatherings</p>
              <p className="text-sm text-gray-500">Serves 5-7 people</p>
            </div>

            {/* 19 Bouquet */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center border-2 border-primary-400">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Popular
              </div>
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">19</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Medium Bouquet</h3>
              <p className="text-gray-600 mb-4">Ideal for parties and celebrations</p>
              <p className="text-sm text-gray-500">Serves 15-19 people</p>
            </div>

            {/* 44 Bouquet */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">44</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Large Bouquet</h3>
              <p className="text-gray-600 mb-4">Great for bigger events</p>
              <p className="text-sm text-gray-500">Serves 35-44 people</p>
            </div>

            {/* 86 Bouquet */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-primary-600">86</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">XL Bouquet</h3>
              <p className="text-gray-600 mb-4">Perfect for large gatherings</p>
              <p className="text-sm text-gray-500">Serves 70-86 people</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The cupcake bouquet for our wedding was absolutely stunning! Guests couldn't stop
                talking about how beautiful and delicious it was."
              </p>
              <p className="font-semibold text-gray-900">Sarah M.</p>
              <p className="text-sm text-gray-500">Wedding Client</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Ordered a custom cake for my daughter's birthday. The attention to detail and
                flavor were exceptional. Highly recommend!"
              </p>
              <p className="font-semibold text-gray-900">James T.</p>
              <p className="text-sm text-gray-500">Birthday Client</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "We've ordered from Padiescakes for multiple corporate events. Always professional,
                on-time, and delicious!"
              </p>
              <p className="font-semibold text-gray-900">Lisa K.</p>
              <p className="text-sm text-gray-500">Corporate Client</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Follow Us on Instagram
          </h2>
          <p className="text-center text-gray-600 mb-12">@padiescakes</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden shadow-md group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-300 to-secondary-300 flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform duration-300">
                  IG Post {i}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @padiescakes
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
