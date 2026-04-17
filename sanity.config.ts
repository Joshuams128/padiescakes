import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'n24cqha8'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: "Padie's Cakes",
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {types: schemaTypes},
})
