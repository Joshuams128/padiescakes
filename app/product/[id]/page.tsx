import Link from 'next/link';
import { sanityClient } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity';
import { getProductBySlug, type SanityProduct } from '@/lib/queries';
import { type Product } from '@/lib/products';
import ProductPageContent from './ProductPageContent';

function toProduct(p: SanityProduct): Product {
  return {
    id: p.slug.current,
    name: p.name,
    category: p.category,
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
  };
}

const relatedProductFields = `
  _id,
  name,
  slug,
  category,
  description,
  basePrice,
  image { asset, alt },
  secondaryImage { asset, alt },
  flavors[]->{ _id, name },
  maxFlavors,
  minOrder,
  sizes[] { name, pieces, price, serves },
  dietaryPrices[] { key, price }
`;

async function getRelatedProducts(category: string, currentSlug: string): Promise<SanityProduct[]> {
  return sanityClient.fetch(
    `*[_type == "product" && available == true && category == $category && slug.current != $currentSlug] | order(name asc) [0...4] {${relatedProductFields}}`,
    { category, currentSlug },
    { next: { tags: ['sanity', 'product'] } },
  );
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sanityProduct = await getProductBySlug(id);

  if (!sanityProduct) {
    return (
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/shop" className="btn-primary">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const product = toProduct(sanityProduct);
  const sanityRelated = await getRelatedProducts(sanityProduct.category, id);
  const relatedProducts = sanityRelated.map(toProduct);

  return <ProductPageContent product={product} relatedProducts={relatedProducts} />;
}
