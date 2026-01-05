import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const prerender = require('vite-plugin-prerender')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    prerender({
      staticDir: 'dist',
      renderTarget: '#app',
      routes: [
        '/',
        '/como-calcular-4x1000/',
        '/exenciones-4x1000/',
        '/tabla-4x1000/'
      ]
    })
  ],
})
