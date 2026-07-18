// Single source of truth for top-bar nav links. Header.jsx renders these for
// the live app, and scripts/prerender.mjs reads the same array to regenerate
// the static public/404.html nav on every build, so the two never drift.
export const navLinks = [{ to: '/', label: 'home' }]
