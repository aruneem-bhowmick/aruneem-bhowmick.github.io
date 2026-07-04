export const posts = []

export function postYear(post) {
  return post.date.slice(0, 4)
}

export function postUrl(post) {
  return `/blog/${postYear(post)}/${post.slug}`
}

export function getPost(year, slug) {
  return posts.find((p) => p.slug === slug && postYear(p) === year)
}

export function getAllTags() {
  const set = new Set()
  for (const p of posts) for (const t of p.tags) set.add(t)
  return ['all', ...Array.from(set)]
}
