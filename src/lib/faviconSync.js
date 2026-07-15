// data-theme (set on <html>, driven by the theme toggle + localStorage) is the
// app's single source of truth for theme, so the favicon should follow it too
// rather than the OS prefers-color-scheme setting.
const ICONS = { dark: '/favicon.svg', light: '/favicon-light.svg' }

function syncFavicon() {
  const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  document.querySelector('link[rel="icon"]').href = ICONS[theme]
}

syncFavicon()

new MutationObserver(syncFavicon).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme'],
})
