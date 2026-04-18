import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-[color:var(--color-cream-50)] text-[color:var(--color-espresso-900)] overflow-hidden">
      <div className="container-custom grid lg:grid-cols-12 gap-10 lg:gap-16 items-center pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-24 lg:pb-28">
        {/* Copy */}
        <div className="lg:col-span-6 order-2 lg:order-1">
          <span className="inline-block text-xs uppercase tracking-[0.28em] text-[color:var(--color-espresso-500)] mb-5">
            Toronto · est. hand-piped
          </span>
          <h1 className="font-serif font-light leading-[1.02] tracking-tight text-[clamp(2.5rem,6.5vw,5rem)]">
            Cakes made to be{' '}
            <em className="italic font-normal text-[color:var(--color-blush-400)]">
              remembered
            </em>
            .
          </h1>
          <p className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-[color:var(--color-espresso-700)]">
            Small-batch celebration cakes, weddings, cupcakes &amp; cookies —
            hand-piped in our Toronto kitchen, one order at a time.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/shop" className="btn-espresso">
              Order Now
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/shop"
              className="text-[color:var(--color-espresso-900)] font-medium underline underline-offset-[6px] decoration-[color:var(--color-blush-300)] decoration-2 hover:decoration-[color:var(--color-blush-400)] transition-colors"
            >
              View the menu
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-6 max-w-sm border-t border-[color:var(--color-espresso-900)]/10 pt-6 text-sm">
            <div>
              <dt className="text-[color:var(--color-espresso-500)]">Since</dt>
              <dd className="font-serif text-xl mt-1">2019</dd>
            </div>
            <div>
              <dt className="text-[color:var(--color-espresso-500)]">Orders</dt>
              <dd className="font-serif text-xl mt-1">2,400+</dd>
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
              src="/images/heart-shaped-vintage-cake.jpg"
              alt="A vintage piped heart-shaped cake — Padie's Cakes"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-espresso-900)]/15 to-transparent pointer-events-none" />
          </div>
          <div className="hidden lg:block absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-[color:var(--color-blush-100)] -z-0" />
          <div className="hidden lg:block absolute -top-4 right-8 w-20 h-20 rounded-full bg-[color:var(--color-cream-200)] -z-0" />
        </div>
      </div>
    </section>
  );
}
