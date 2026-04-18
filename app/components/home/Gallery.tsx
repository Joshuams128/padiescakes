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
      </div>
    </section>
  );
}
