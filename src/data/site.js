export const siteName = 'Aruneem Bhowmick'
export const siteUrl = 'https://aruneem-bhowmick.github.io'
export const siteDescription =
  'Aruneem Bhowmick works on reasoning architectures, representation learning, and mechanistic interpretability.'
export const defaultOgImage = '/images/pfp.jpg'

export function toAbsoluteUrl(path) {
  return new URL(path, siteUrl).toString()
}

// Canonical identity graph: every profile that is unambiguously the same
// person. Mirrored 1:1 by the rel="me" links rendered on the home page, and
// fed into the Person JSON-LD `sameAs` field so search engines can tie this
// site to those profiles as one entity.
export const sameAs = [
  'https://github.com/aruneem-bhowmick',
  'https://www.linkedin.com/in/aruneem-bhowmick/',
  'https://x.com/aruneembhowmick',
  'https://www.kaggle.com/aruneembhowmick',
  'https://substack.com/@aruneembhowmick',
  'https://leetcode.com/u/aruneem-bhowmick/',
  'https://open.kattis.com/users/aruneem-bhowmick',
  'https://aruneem-bhowmick-hackathons.vercel.app/',
]

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteName,
    alternateName: 'Aruneem',
    url: siteUrl,
    image: toAbsoluteUrl(defaultOgImage),
    description: siteDescription,
    sameAs,
    affiliation: {
      '@type': 'CollegeOrUniversity',
      name: 'Jeffrey S. Raikes School of Computer Science and Management, University of Nebraska-Lincoln',
      url: 'https://raikes.unl.edu/',
    },
  }
}

// Trailing-slash canonical form. GitHub Pages serves directory routes
// (e.g. /blog/2026/nextlat/index.html) and 301-redirects the no-slash URL to
// the trailing-slash one, so canonical URLs and the sitemap must use it too.
export function canonicalPath(path) {
  if (!path || path === '/') return '/'
  const trimmed = path.replace(/\/+$/, '')
  return `${trimmed}/`
}

// Page <title>. Avoids "Aruneem Bhowmick | Aruneem Bhowmick" when the page title already
// equals the site name (the home page).
export function buildTitle(title) {
  return title && title !== siteName ? `${title} | ${siteName}` : siteName
}
