# CLAUDE.md

Calculadora del 4x1000 (GMF) de Colombia en https://www.4x1000.co. Astro estático + islas Svelte 5 + Tailwind 3. Se despliega en Vercel desde `main`.

## Comandos

- `npm run dev` — servidor de desarrollo
- `npm run build` — genera `dist/` (HTML estático por ruta, sitemap, llms.txt)
- `npm run preview` — sirve `dist/`
- `npm test` — tests de las cuentas (vitest)

## Estructura

- `src/data/tax.js` — **todas** las cifras tributarias (UVT, topes, SMLMV, fuentes, fecha). Actualizar cada enero y regenerar `public/og.png` desde `scripts/og.html`.
- `src/data/site.js` — guías y montos con página propia; `src/data/faq.js` — preguntas compartidas (HTML y JSON-LD salen del mismo arreglo).
- `src/lib/gmf.js` — cuentas del GMF (directo, inverso, tope exento, anual). Probadas en `gmf.test.js`.
- `src/lib/*.svelte` — calculadoras (islas `client:load`) y sus piezas.
- `src/layouts/Base.astro` — head por página (title, canonical, OG, JSON-LD), header y footer; `Guide.astro` — plantilla de guía (Article + BreadcrumbList + FAQPage).
- `src/pages/` — rutas; `4x1000-de-[slug].astro` genera las páginas por monto; `llms.txt.js` y `llms-full.txt.js` salen de `src/data/`.

## Convenciones

- Identificadores en inglés; comentarios y textos en español con tildes.
- No inventar datos tributarios: toda cifra sale de `tax.js` con su fuente.
- Umami sólo recibe el nombre del evento, nunca montos ni resultados.
- `vercel.json`: redirección 4x1000.co → www, `trailingSlash: true` y `/sitemap.xml` → `/sitemap-index.xml`.
