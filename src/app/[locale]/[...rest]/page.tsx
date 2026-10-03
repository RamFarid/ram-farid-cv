import { notFound } from 'next/navigation'

// Unknown paths under a locale render [locale]/not-found.tsx (localized) instead of Next's default 404.
export default function CatchAll() {
  notFound()
}
