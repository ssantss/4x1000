# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Colombian GMF (4x1000) tax calculator — a PWA built with Svelte 5 + Vite + Tailwind CSS, deployed on Vercel at www.4x1000.co.

## Commands

- `npm run dev` — Start dev server (Vite HMR)
- `npm run build` — Production build with static prerendering
- `npm run preview` — Preview production build locally

No test runner or linter is configured.

## Architecture

**Single-page app (no router)** with 4 pre-rendered static routes via `vite-plugin-prerender`:
- `/` — Main calculator
- `/como-calcular-4x1000/` — How-to guide
- `/exenciones-4x1000/` — Exemptions info
- `/tabla-4x1000/` — Quick reference table

All routes render the same `App.svelte`; `SeoContent.svelte` provides the informational sections.

**Component hierarchy:**
```
App.svelte (root layout)
├── Calculadora4x1000.svelte   ← all calculator state & logic lives here
│   ├── DarkModeToggle
│   ├── Instrucciones
│   ├── ResultadoCard (×4, one per result type)
│   └── HistorialItem (×N, calculation history)
├── SeoContent.svelte
├── Footer.svelte
└── InstallPWA.svelte
```

**State:** Svelte 5 runes (`$state()`) — all client-side. History and dark mode preference persisted to `localStorage`.

**Path alias:** `$lib` → `src/lib/` (configured in `jsconfig.json`)

## Key Conventions

- **Language:** JavaScript (no TypeScript). Type checking via `jsconfig.json` with `checkJs: true`.
- **Naming:** Spanish throughout — component names, variables, functions, UI text.
- **Styling:** 100% Tailwind utility classes. Dark mode uses class-based strategy (`darkMode: 'class'` in `tailwind.config.js`).
- **Components:** Top-level in `src/lib/`, reusable UI pieces in `src/lib/components/`.
- **Utilities:** `src/utils/utils.js` — number formatting helpers for Colombian currency (COP).
- **Events:** Svelte 5 style (`onclick`, `oninput`) — not legacy `on:click` directives.
- **SEO:** `index.html` contains JSON-LD structured data (WebApplication + FAQPage schemas), Open Graph, and Twitter Card meta tags.
- **Analytics:** Umami loaded via CDN script in `index.html`.
- **PWA:** Service worker in `public/sw.js`, manifest in `public/manifest.json`, install prompt via `InstallPWA.svelte`.

## Deployment

Vercel with static output. `vercel.json` redirects bare domain `4x1000.co` → `www.4x1000.co` (301). Prerendered HTML lives in `dist/`.
