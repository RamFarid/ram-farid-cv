export default function makeSlug(word) {
  let slug = word.toLowerCase().replace(/\s+/g, '-')
  slug = slug.replace(/[^a-z0-9-]/g, '')
  slug = slug.replace(/-+/g, '-')
  slug = slug.replace(/^-+|-+$/g, '')

  return slug
}
