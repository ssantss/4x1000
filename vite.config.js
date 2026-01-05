import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const prerender = require('vite-plugin-prerender')
const Renderer = require('@prerenderer/renderer-jsdom')
const PrerenderRenderer = Renderer.default || Renderer

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    prerender({
      staticDir: path.resolve(process.cwd(), 'dist'),
      renderTarget: '#app',
      renderer: new PrerenderRenderer(),
      routes: [
        '/',
        '/como-calcular-4x1000/',
        '/exenciones-4x1000/',
        '/tabla-4x1000/'
      ]
    })
  ],
})
