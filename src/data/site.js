export const siteName = 'Aruneem Bhowmick'
export const siteUrl = 'https://aruneem-bhowmick.github.io'
export const siteDescription =
  'Aruneem Bhowmick works on reasoning architectures, representation learning, and mechanistic interpretability.'
export const defaultOgImage = '/images/pfp.jpg'

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
