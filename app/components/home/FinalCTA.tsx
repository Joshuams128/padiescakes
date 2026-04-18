import Link from 'next/link';
import Reveal from './Reveal';

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--color-blush-400)]">
      <div className="container-custom py-20 sm:py-28 relative z-10">
        <Reveal className="max-w-3xl">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[color:var(--color-cream-50)]">
            Ready to order your cake?
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-[color:var(--color-cream-100)]/90 max-w-xl">
            Birthdays, weddings, weekday pick-me-ups — tell us what you&apos;re
            celebrating and we&apos;ll pipe it into something worth the photo.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[color:var(--color-espresso-900)] text-[color:var(--color-cream-50)] font-medium tracking-wide px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-[color:var(--color-espresso-700)] hover:-translate-y-0.5"
            >
              Start your order
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-[color:var(--color-cream-50)] font-medium tracking-wide px-6 py-3 rounded-full border border-[color:var(--color-cream-50)]/60 hover:bg-[color:var(--color-cream-50)]/10 transition"
            >
              Request a custom quote
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Soft decorative blobs */}
      <div
        aria-hidden="true"
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[color:var(--color-blush-200)]/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-[color:var(--color-cream-100)]/40 blur-3xl"
      />
    </section>
  );
}
