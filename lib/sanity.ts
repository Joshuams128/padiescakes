import {createClient} from 'next-sanity'
import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'n24cqha8'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2024-01-01'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

const builder = createImageUrlBuilder(sanityClient)

export const urlFor = (source: SanityImageSource) => builder.image(source)
