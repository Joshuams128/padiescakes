import Image from 'next/image';
import Link from 'next/link';
import Reveal from './Reveal';

interface FeaturedProduct {
  name: string;
  slug: string;
  basePrice: number;
  category: string;
  image: string;
  alt: string;
}

const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    name: 'Heart Shaped Vintage Cake',
    slug: 'heart-shaped-vintage-cake',
    basePrice: 100,
    category: 'cakes',
    image: '/images/heart-shaped-vintage-cake.jpg',
    alt: 'Heart Shaped Vintage Cake',
  },
  {
    name: '14 Mini Cupcake Bouquet on a Cake Board',
    slug: '14-mini-cupcake-bouquet-on-a-cake-board',
    basePrice: 50,
    category: 'mini-cupcakes',
    image: '/images/14MiniCupcake.jpeg',
    alt: '14 Mini Cupcake Bouquet on a Cake Board',
  },
  {
    name: 'Cupcake Gift Box – Box of 4',
    slug: '4-cupcake-giftbox',
    basePrice: 30,
    category: 'boxed-cupcakes',
    image: '/images/giftbox.webp',
    alt: 'Cupcake Gift Box – Box of 4',
  },
  {
    name: '12-Cupcake Bouquet',
    slug: '12-cupcake-bouquet',
    basePrice: 95,
    category: 'bouquets',
    image: '/images/12cupcakebouquet.png',
    alt: '12-Cupcake Bouquet',
  },
];

export default async function SignatureCakes() {
  const featured = FEATURED_PRODUCTS;

  return (
    <section className="bg-[color:var(--color-cream-50)] py-20 sm:py-24">
      <div className="container-custom">
        <Reveal className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-blush-400)]">
              Signature
            </span>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight text-[color:var(--color-espresso-900)]">
              Our most loved Products
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
          {featured.map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 80}>
              <Link
                href={`/product/${p.slug}`}
                className="group block h-full"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[color:var(--color-cream-100)]">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
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
          ))}
        </ul>
      </div>
    </section>
  );
}
