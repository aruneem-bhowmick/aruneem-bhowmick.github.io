// Static pre-rendering for the GitHub Pages SPA.
//
// A client-rendered SPA on GitHub Pages has two SEO-fatal problems:
//   1. Deep links (e.g. /blog/2026/nextlat) have no real file, so Pages serves
//      the 404.html fallback with an HTTP 404 status -> Google won't index them.
//   2. Meta tags are injected by JS after load, so non-JS scrapers (X, LinkedIn,
//      Slack) only ever see the generic index.html title/description.
//
// This script runs after `vite build`. For every known route it writes a real
// <route>/index.html (200 status) with the correct <title>, description,
// canonical, Open Graph, Twitter, and JSON-LD baked into the initial HTML. The
// React app still hydrates and renders the full body client-side; Googlebot
// executes that JS for the article text. It also regenerates sitemap.xml so it
// can never drift from the route list.
//
// 404.html itself is a plain static file at public/404.html (no SPA boot)
// that Vite copies straight into dist/, so GitHub Pages serves it with a real
// 404 status for any unmatched path. Its top-bar nav links, though, are
// generated below from the same src/data/nav.js that Header.jsx renders, so
// the 404 page's nav can never drift out of sync with the live site's.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildTitle,
  canonicalPath,
  defaultOgImage,
  personJsonLd,
  siteDescription,
  siteName,
  toAbsoluteUrl as toAbsolute,
} from '../src/data/site.js'
import { navLinks } from '../src/data/nav.js'

const distDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')

const escapeAttr = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
// Inline JSON-LD: only `<` needs escaping to avoid prematurely closing <script>.
const escapeJsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c')

// Routes to pre-render. Descriptions/images mirror what each page passes to the
// <SEO> component so the pre-rendered HTML and the hydrated DOM agree.
const routes = [
  {
    path: '/',
    title: siteName,
    description: siteDescription,
    image: defaultOgImage,
    jsonLd: personJsonLd(),
  },
]

function metaTags(route) {
  const fullTitle = buildTitle(route.title)
  const canonicalUrl = toAbsolute(canonicalPath(route.path))
  const imageUrl = route.image ? toAbsolute(route.image) : null
  const ogType = route.type || 'website'

  const tags = [
    ['property="og:title"', `<meta property="og:title" content="${escapeAttr(fullTitle)}" />`],
    [
      'property="og:description"',
      `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
    ],
    ['property="og:type"', `<meta property="og:type" content="${ogType}" />`],
    ['property="og:url"', `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`],
    [
      'name="twitter:card"',
      `<meta name="twitter:card" content="${imageUrl ? 'summary_large_image' : 'summary'}" />`,
    ],
    ['name="twitter:title"', `<meta name="twitter:title" content="${escapeAttr(fullTitle)}" />`],
    [
      'name="twitter:description"',
      `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
    ],
    ['rel="canonical"', `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`],
  ]
  if (imageUrl) {
    tags.push([
      'property="og:image"',
      `<meta property="og:image" content="${escapeAttr(imageUrl)}" />`,
    ])
    tags.push([
      'name="twitter:image"',
      `<meta name="twitter:image" content="${escapeAttr(imageUrl)}" />`,
    ])
  }

  const jsonLd = route.jsonLd
    ? route.jsonLd
    : route.isPost
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: route.title,
          description: route.description,
          image: imageUrl,
          datePublished: route.date,
          dateModified: route.date,
          author: { '@type': 'Person', name: siteName, url: toAbsolute('/') },
          publisher: { '@type': 'Person', name: siteName },
          mainEntityOfPage: canonicalUrl,
          ...(route.tags?.length ? { keywords: route.tags.join(', ') } : {}),
        }
      : null

  return { fullTitle, head: tags.map(([, html]) => html), jsonLd }
}

// Inject route-specific metadata into the built index.html template.
function render(template, route) {
  const { fullTitle, head, jsonLd } = metaTags(route)
  const extra = [...head]
  if (jsonLd) {
    extra.push(`<script type="application/ld+json">${escapeJsonLd(jsonLd)}</script>`)
  }

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(fullTitle)}</title>`)
    .replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${escapeAttr(route.description)}" />`,
    )
    .replace(
      /<meta\s+name="robots"[^>]*\/>/,
      `<meta name="robots" content="${route.noindex ? 'noindex,nofollow' : 'index,follow'}" />`,
    )
    .replace('</head>', `    ${extra.join('\n    ')}\n  </head>`)
}

async function writeRoute(template, route) {
  const html = render(template, route)
  const outPath =
    route.path === '/'
      ? join(distDir, 'index.html')
      : join(distDir, route.path, 'index.html')
  await mkdir(dirname(outPath), { recursive: true })
  await writeFile(outPath, html)
  return outPath
}

function buildSitemap() {
  const entries = routes
    .map((route) => {
      const loc = toAbsolute(canonicalPath(route.path))
      const lastmod = route.date ? `\n    <lastmod>${route.date}</lastmod>` : ''
      return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

// Regenerates the 404 page's <nav> from src/data/nav.js so it always mirrors
// the live Header.jsx nav links without anyone hand-editing public/404.html.
async function syncNotFoundNav() {
  const path = join(distDir, '404.html')
  const html = await readFile(path, 'utf8')
  const links = navLinks
    .map((link) => `<a href="${escapeAttr(link.to)}" class="nav-link">${escapeAttr(link.label)}</a>`)
    .join('\n          ')

  if (!html.includes('<!--NAV_LINKS-->')) {
    throw new Error('dist/404.html is missing the <!--NAV_LINKS--> placeholder')
  }

  await writeFile(path, html.replace('<!--NAV_LINKS-->', links))
  console.log(`synced ${navLinks.length} nav link(s) into dist/404.html`)
}

async function main() {
  const template = await readFile(join(distDir, 'index.html'), 'utf8')

  for (const route of routes) {
    const outPath = await writeRoute(template, route)
    console.log(`prerendered ${route.path} -> ${outPath.replace(distDir, 'dist')}`)
  }

  await writeFile(join(distDir, 'sitemap.xml'), buildSitemap())
  console.log(`wrote dist/sitemap.xml (${routes.length} urls)`)

  await syncNotFoundNav()
}

main().catch((err) => {
  console.error('prerender failed:', err)
  process.exit(1)
})
