import { SITE_URL, SITE_NAME } from '../data/site.js'
import { UPDATED_ISO } from '../data/tax.js'

// Constructores de JSON-LD (schema.org)

const absolute = (path) => new URL(path, SITE_URL).href

export const organization = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
}

export function webApplication({ name, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: absolute(path),
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    inLanguage: 'es-CO',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'COP' },
    publisher: organization,
  }
}

export function faqPage(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

// crumbs: [{ name, path }], el inicio se agrega solo
export function breadcrumbList(crumbs) {
  const all = [{ name: 'Inicio', path: '/' }, ...crumbs]
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absolute(c.path),
    })),
  }
}

export function article({ title, description, path, published = UPDATED_ISO }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: absolute(path),
    mainEntityOfPage: absolute(path),
    inLanguage: 'es-CO',
    datePublished: published,
    dateModified: UPDATED_ISO,
    author: organization,
    publisher: organization,
    image: absolute('/og.png'),
  }
}

export function howTo({ name, description, steps }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
  }
}
