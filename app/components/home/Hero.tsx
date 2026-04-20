import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-[color:var(--color-cream-50)] text-[color:var(--color-espresso-900)] overflow-hidden">
      <div className="container-custom grid lg:grid-cols-12 gap-10 lg:gap-16 items-center pt-8 pb-12 sm:pt-10 sm:pb-14 lg:pt-16 lg:pb-20">
        {/* Copy */}
        <div className="lg:col-span-6 order-2 lg:order-1">
          <h1 className="font-serif font-light leading-[1.02] tracking-tight text-[clamp(2.5rem,6.5vw,5rem)]">
            Cupcakes made to be{' '}
            <em className="italic font-normal text-[color:var(--color-blush-400)]">
              remembered
            </em>
            .
          </h1>
          <p className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-[color:var(--color-espresso-700)]">
             Handcrafted cupcake bouquets and custom cakes for every special occasion.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/shop" className="btn-espresso">
              View our treats
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 max-w-sm border-t border-[color:var(--color-espresso-900)]/10 pt-6 text-sm">
            <div>
              <dt className="text-[color:var(--color-espresso-500)]">Since</dt>
              <dd className="font-serif text-xl mt-1">2021</dd>
            </div>
            <div>
              <dt className="text-[color:var(--color-espresso-500)]">Orders</dt>
              <dd className="font-serif text-xl mt-1">1000</dd>
            </div>
            <div>
              <dt className="text-[color:var(--color-espresso-500)]">Rating</dt>
              <dd className="font-serif text-xl mt-1">5.0</dd>
            </div>
          </dl>
        </div>

        {/* Image */}
        <div className="lg:col-span-6 order-1 lg:order-2 relative">
          <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] max-h-[78vh] w-full rounded-[28px] overflow-hidden shadow-[0_30px_80px_-30px_rgba(74,47,34,0.35)]">
            <Image
              src="/images/12cupcakebouquet.png"
              alt="12-Cupcake Bouquet — Padie's Cakes"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-espresso-900)]/15 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
