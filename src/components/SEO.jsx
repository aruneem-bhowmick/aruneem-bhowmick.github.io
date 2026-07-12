import { useEffect } from 'react'
import { buildTitle, canonicalPath, defaultOgImage, personJsonLd, toAbsoluteUrl } from '../data/site.js'

function upsertMeta(selector, attrs) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }
  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value)
  }
}

function upsertLink(selector, attrs) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('link')
    document.head.appendChild(element)
  }
  for (const [key, value] of Object.entries(attrs)) {
    element.setAttribute(key, value)
  }
}

function upsertJsonLd(id, data) {
  let element = document.head.querySelector(`script[data-seo-jsonld="${id}"]`)
  if (!element) {
    element = document.createElement('script')
    element.type = 'application/ld+json'
    element.setAttribute('data-seo-jsonld', id)
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(data)
}

export default function SEO({
  title,
  description,
  path = '/',
  image = defaultOgImage,
  type = 'website',
  noindex = false,
  personSchema = false,
}) {
  useEffect(() => {
    const fullTitle = buildTitle(title)
    const canonicalUrl = toAbsoluteUrl(canonicalPath(path))
    const imageUrl = image ? toAbsoluteUrl(image) : null

    document.title = fullTitle

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex,nofollow' : 'index,follow',
    })
    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: fullTitle,
    })
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: type,
    })
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    })
    if (imageUrl) {
      upsertMeta('meta[property="og:image"]', {
        property: 'og:image',
        content: imageUrl,
      })
    }
    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: imageUrl ? 'summary_large_image' : 'summary',
    })
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: fullTitle,
    })
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })
    if (imageUrl) {
      upsertMeta('meta[name="twitter:image"]', {
        name: 'twitter:image',
        content: imageUrl,
      })
    }
    upsertLink('link[rel="canonical"]', {
      rel: 'canonical',
      href: canonicalUrl,
    })

    if (personSchema) {
      upsertJsonLd('person', personJsonLd())
    }
  }, [description, image, noindex, path, personSchema, title, type])

  return null
}
