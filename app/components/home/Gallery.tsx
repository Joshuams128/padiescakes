import Image from 'next/image';
import Reveal from './Reveal';

/**
 * TODO (CMS): no Sanity `gallery` / `galleryImage` schema exists yet.
 * To wire this up later:
 *   1. Add `sanity/schemas/galleryImage.ts` (fields: image{hotspot}, alt, caption, featured?: boolean, order?: number).
 *   2. Register it in `sanity/schemas/index.ts`.
 *   3. Add `getGalleryImages()` in `lib/queries.ts` (order by `order asc`, limit 8).
 *   4. Replace the static `items` array below with the fetched results and swap <Image src/> to `urlFor(item.image).url()`.
 */

type GalleryItem = {
  src: string;
  alt: string;
  /** `tall` items span two rows on large screens to create the asymmetric feel. */
  tall?: boolean;
};

const items: GalleryItem[] = [
  { src: '/images/heart-shaped-vintage-cake.jpg', alt: 'Vintage heart-shaped cake', tall: true },
  { src: '/images/7-cupcake-bouquet.jpg', alt: '7-cupcake floral bouquet' },
  { src: '/images/allmylove-2.JPG', alt: 'All My Love bouquet in red' },
  { src: '/images/12cupcakebouquet.png', alt: '12 cupcake bouquet' },
  { src: '/images/vintagecake2.jpeg', alt: '8-inch vintage cake', tall: true },
  { src: '/images/44-Cupcake-Bouquet-scaled.jpg', alt: '44 cupcake bouquet for weddings' },
  { src: '/images/dozencakepops.jpeg', alt: 'A dozen decorated cake pops' },
  { src: '/images/6floralcucpakes-scaled.jpg', alt: '6 hand-piped floral cupcakes' },
];

export default function Gallery() {
  return (
    <section className="bg-[color:var(--color-cream-100)] py-20 sm:py-24">
      <div className="container-custom">
        <Reveal className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-[0.28em] text-[color:var(--color-blush-400)]">
            Past work
          </span>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight text-[color:var(--color-espresso-900)]">
            From our kitchen
          </h2>
          <p className="mt-4 text-[color:var(--color-espresso-700)] text-lg">
            A peek at recent cakes, bouquets and weddings — tag us on
            Instagram and we&apos;ll share yours next.
          </p>
        </Reveal>

        <ul
          className="
            grid gap-3 sm:gap-4
            grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
            lg:auto-rows-[180px]
          "
        >
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.src}
              delay={i * 60}
              className={`relative overflow-hidden rounded-2xl bg-[color:var(--color-cream-200)] ${
                item.tall ? 'lg:row-span-2 aspect-[3/4] lg:aspect-auto' : 'aspect-square'
              }`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
              />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
