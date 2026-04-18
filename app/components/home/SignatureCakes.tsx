import Image from 'next/image';
import Link from 'next/link';
import { getProducts, type SanityProduct } from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
import Reveal from './Reveal';

const FEATURED_CATEGORIES: SanityProduct['category'][] = ['cakes', 'bouquets'];

function pickFeatured(products: SanityProduct[]): SanityProduct[] {
  const inCategory = products.filter((p) => FEATURED_CATEGORIES.includes(p.category));
  const pool = inCategory.length >= 4 ? inCategory : products;
  // Pick up to 4, preferring products with imagery.
  return pool.filter((p) => p.image?.asset).slice(0, 4);
}

export default async function SignatureCakes() {
  let featured: SanityProduct[] = [];
  try {
    const products = await getProducts();
    featured = pickFeatured(products);
  } catch {
    featured = [];
  }

  if (featured.length === 0) return null;

  return (
    <section className="bg-[color:var(--color-cream-50)] py-20 sm:py-24">
      <div className="container-custom">
        <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-blush-400)]">
              Signature
            </span>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight text-[color:var(--color-espresso-900)]">
              Our most loved cakes
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-[color:var(--color-espresso-900)] font-medium underline underline-offset-[6px] decoration-[color:var(--color-blush-300)] decoration-2 hover:decoration-[color:var(--color-blush-400)] transition"
          >
            See full menu →
          </Link>
        </Reveal>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featured.map((p, i) => {
            const img = p.image?.asset ? urlFor(p.image).width(900).height(1100).url() : '';
            return (
              <Reveal as="li" key={p._id} delay={i * 80}>
                <Link
                  href={`/product/${p.slug.current}`}
                  className="group block h-full"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[color:var(--color-cream-100)]">
                    {img && (
                      <Image
                        src={img}
                        alt={p.image?.alt || p.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                    )}
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-xl text-[color:var(--color-espresso-900)] leading-snug">
                      {p.name}
                    </h3>
                    <span className="font-sans text-sm tabular-nums text-[color:var(--color-espresso-700)] whitespace-nowrap">
                      from ${p.basePrice}
                    </span>
                  </div>
                  <span className="mt-1 block text-sm text-[color:var(--color-espresso-500)] capitalize">
                    {p.category.replace('-', ' ')}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
