import { Suspense } from 'react';
import { getProducts, getCategories } from '@/lib/queries';
import { urlFor } from '@/lib/sanity';
import { type Product } from '@/lib/products';
import ShopContent from './ShopContent';

export default async function ShopPage() {
  const [sanityProducts, sanityCategories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const products: Product[] = sanityProducts.map((p) => ({
    id: p.slug.current,
    name: p.name,
    category: p.category?.slug ?? '',
    description: p.description ?? '',
    basePrice: p.basePrice,
    image: p.image?.asset ? urlFor(p.image).width(800).url() : '',
    secondaryImage: p.secondaryImage?.asset ? urlFor(p.secondaryImage).width(800).url() : undefined,
    flavors: (p.flavors ?? []).map((f) => f.name),
    maxFlavors: p.maxFlavors,
    minOrder: p.minOrder,
    sizes: p.sizes?.map((s) => ({
      name: s.name,
      pieces: s.pieces ?? 1,
      price: s.price,
      serves: s.serves ?? '',
    })),
    dietaryPrices: p.dietaryPrices?.reduce<Record<string, number>>((acc, d) => {
      acc[d.key] = d.price;
      return acc;
    }, {}),
    fillingPrices: p.fillingPrices?.reduce<Record<string, number>>((acc, d) => {
      acc[d.key] = d.price;
      return acc;
    }, {}),
  }));

  const categories = [
    { id: 'all', name: 'All Products' },
    ...sanityCategories.map((c) => ({ id: c.slug.current, name: c.name })),
  ];

  return (
    <Suspense>
      <ShopContent products={products} categories={categories} />
    </Suspense>
  );
}
