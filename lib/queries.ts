import {sanityClient} from './sanity'

export type ProductCategory =
  | 'bouquets'
  | 'boxed-cupcakes'
  | 'mini-cupcakes'
  | 'cakes'
  | 'party-favours'

export interface SanityImageRef {
  asset?: {_ref: string}
  alt?: string
}

export interface SanityProductSize {
  name: string
  pieces?: number
  price: number
  serves?: string
}

export interface SanityDietaryPrice {
  key: string
  price: number
}

export interface SanityFlavor {
  _id: string
  name: string
}

export interface SanityProduct {
  _id: string
  name: string
  slug: {current: string}
  category: ProductCategory
  description?: string
  basePrice: number
  image?: SanityImageRef
  secondaryImage?: SanityImageRef
  flavors?: SanityFlavor[]
  maxFlavors?: number
  minOrder?: number
  sizes?: SanityProductSize[]
  dietaryPrices?: SanityDietaryPrice[]
  fillingPrices?: SanityDietaryPrice[]
}

export interface SanitySize {
  _id: string
  name: string
  price: number
  servings?: string
}

export interface SanityFilling {
  _id: string
  name: string
}

const productFields = `
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
  dietaryPrices[] { key, price },
  fillingPrices[] { key, price }
`

export async function getProducts(): Promise<SanityProduct[]> {
  return sanityClient.fetch(
    `*[_type == "product" && available == true] | order(name asc) {${productFields}}`,
    {},
    {next: {tags: ['sanity', 'product']}},
  )
}

export async function getProductBySlug(slug: string): Promise<SanityProduct | null> {
  return sanityClient.fetch(
    `*[_type == "product" && slug.current == $slug && available == true][0] {${productFields}}`,
    {slug},
    {next: {tags: ['sanity', 'product', `product:${slug}`]}},
  )
}

export async function getFlavors(): Promise<SanityFlavor[]> {
  return sanityClient.fetch(
    `*[_type == "flavor" && available == true] | order(name asc) { _id, name }`,
    {},
    {next: {tags: ['sanity', 'flavor']}},
  )
}

export async function getSizes(): Promise<SanitySize[]> {
  return sanityClient.fetch(
    `*[_type == "size" && available == true] | order(price asc) { _id, name, price, servings }`,
    {},
    {next: {tags: ['sanity', 'size']}},
  )
}

export async function getFillings(): Promise<SanityFilling[]> {
  return sanityClient.fetch(
    `*[_type == "filling" && available == true] | order(name asc) { _id, name }`,
    {},
    {next: {tags: ['sanity', 'filling']}},
  )
}
