// One-time migration: sets `showDietaryOptions: true` on every existing product
// where the field is missing. New products get this default automatically via
// the schema's initialValue, but pre-existing ones need a backfill so their
// Studio toggle reflects the on-page behavior.
//
// Usage:
//   SANITY_API_WRITE_TOKEN=sk_... node scripts/migrate-show-dietary.mjs

import {createClient} from '@sanity/client'

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN env var.')
  console.error('Get one at https://www.sanity.io/manage/project/n24cqha8/api (Editor role).')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'n24cqha8',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

const products = await client.fetch(
  `*[_type == "product" && !defined(showDietaryOptions)]{ _id, name }`,
)

if (products.length === 0) {
  console.log('Nothing to migrate — all products already have showDietaryOptions set.')
  process.exit(0)
}

console.log(`Setting showDietaryOptions = true on ${products.length} product(s):`)
let tx = client.transaction()
for (const p of products) {
  console.log(`  - ${p.name}`)
  tx = tx.patch(p._id, (patch) => patch.set({showDietaryOptions: true}))
}

await tx.commit()
console.log('Done.')
