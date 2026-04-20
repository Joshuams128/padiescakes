'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Reveal from './Reveal';

const FULL_TEXT = 'Indulge in a statement-making centerpiece with our 44 Floral Cupcake Bouquet, a luxurious arrangement of forty-four beautifully crafted cupcakes, each decorated to resemble delicate, hand-formed blooms in soft, elegant tones. Designed to reflect the sophistication of a fresh floral display, every cupcake features refined piping and detailed artistry, making it perfect for weddings, upscale celebrations, and large gatherings. With its impressive size and cohesive design, this bouquet serves as both a stunning focal point and a delicious treat that leaves a lasting impression.';

const SHORT_TEXT = 'Indulge in a statement-making centerpiece with our 44 Floral Cupcake Bouquet. A luxurious arrangement of forty-four beautifully crafted cupcakes, each decorated to resemble delicate blooms in soft, elegant tones. Perfect for weddings and special celebrations.';

export default function Story() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-[color:var(--color-blush-50)] py-20 sm:py-28">
      <div className="container-custom grid lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-5 order-2 lg:order-1">
          <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:mx-0 rounded-[24px] overflow-hidden">
            <Image
              src="/images/44-Cupcake-Bouquet-scaled.jpg"
              alt="A hand-piped cupcake bouquet from Padie's Cakes"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 80vw, 40vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7 order-1 lg:order-2" delay={120}>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight text-[color:var(--color-espresso-900)] leading-[1.05] max-w-xl">
            Designed for weddings, celebrations, and unforgettable moments.
          </h2>
          <div className="mt-6 space-y-5 text-[color:var(--color-espresso-700)] text-lg leading-relaxed max-w-xl">
            <p>
              <span className="hidden sm:inline">{FULL_TEXT}</span>
              <span className="sm:hidden">{expanded ? FULL_TEXT : SHORT_TEXT}</span>
            </p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="block sm:hidden text-[color:var(--color-blush-400)] font-medium hover:text-[color:var(--color-blush-300)] transition-colors"
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
            <Link
              href="/product/44-cupcake-bouquet"
              className="inline-block mt-8 sm:mt-6 btn-espresso"
            >
              View item
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
