import type { Locale } from 'next-intl'
import type { ProjectCaseStudy, ProjectTeaser } from '@/lib/projects/types'
import { absoluteUrl } from './metadata'
import { siteUrl } from './site'

// JSON-LD builders (https://schema.org). Render them with components/Reusable/seo/JsonLd. See docs/seo.md

// The full Person node (sameAs, knowsAbout) belongs to the SEO step; pages refer to it by @id.
const person = { '@type': 'Person', '@id': `${siteUrl}/#person`, name: 'Ram Farid', url: siteUrl } as const

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function portfolioJsonLd({
  locale,
  name,
  description,
  projects,
}: {
  locale: Locale
  name: string
  description: string
  projects: ProjectTeaser[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl('/portfolio', locale),
    inLanguage: locale,
    author: person,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.title,
        url: absoluteUrl(`/portfolio/${project.slug}`, locale),
      })),
    },
  }
}

export function projectJsonLd(project: ProjectCaseStudy, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/portfolio/${project.slug}`, locale),
    inLanguage: locale,
    genre: project.kind,
    creator: person,
    image: project.cover?.url,
    dateCreated: project.startedAt,
    keywords: project.stack.length ? project.stack.join(', ') : undefined,
    sameAs: project.liveUrl,
  }
}
