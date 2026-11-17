import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://www.4x1000.co',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [svelte(), sitemap()],
})
