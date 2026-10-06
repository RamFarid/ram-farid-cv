import type { Locale } from 'next-intl'
import { routing } from '@/i18n/routing'
import type { FaqItem } from '@/lib/home/faq'
import type { HomeContent } from '@/lib/home/types'
import { contactChannels, homeLocation, spokenLanguages } from '@/lib/profile'
import { findStackTool } from '@/lib/projects/stack'
import type { ProjectCaseStudy, ProjectTeaser } from '@/lib/projects/types'
import { absoluteUrl } from './metadata'
import { siteUrl } from './site'

// JSON-LD builders (https://schema.org). Render them with components/Reusable/seo/JsonLd. See docs/seo.md#structured-data

// The full Person and WebSite nodes are on the home page; every other page refers to them by @id.
const personId = `${siteUrl}/#person`
const websiteId = `${siteUrl}/#website`
const person = { '@type': 'Person', '@id': personId, name: 'Ram Farid', url: siteUrl } as const
const website = { '@id': websiteId } as const

/** Ram's name in each locale's script. */
type Names = Record<Locale, string>

const otherNames = (names: Names, locale: Locale) => routing.locales.filter((code) => code !== locale).map((code) => names[code])

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

/**
 * The home page: a ProfilePage about Ram, the WebSite, and the full Person node (built from the home content, so it
 * can't drift from what the page shows).
 */
export function profilePageJsonLd({
  locale,
  names,
  title,
  description,
  jobTitle,
  home,
  updatedAt,
}: {
  locale: Locale
  names: Names
  title: string
  description: string
  jobTitle: string
  home: HomeContent
  updatedAt: Date | null
}) {
  const url = absoluteUrl('/', locale)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#page`,
        url,
        name: title,
        description,
        inLanguage: locale,
        isPartOf: website,
        mainEntity: { '@id': personId },
        dateModified: updatedAt?.toISOString(),
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteUrl,
        name: names[locale],
        alternateName: otherNames(names, locale),
        inLanguage: routing.locales,
        publisher: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: names[locale],
        alternateName: otherNames(names, locale),
        url: siteUrl,
        image: home.about?.portrait?.url,
        jobTitle,
        description,
        address: { '@type': 'PostalAddress', addressLocality: homeLocation.city, addressCountry: homeLocation.country },
        knowsLanguage: spokenLanguages.map((language) => language.id),
        knowsAbout: [...new Set(home.skillGroups.flatMap((group) => group.items))],
        // Roles without an end date are current.
        worksFor: home.experience
          .filter((role) => !role.endedOn)
          .map((role) => ({ '@type': 'Organization', name: role.organization, url: role.url })),
        hasCredential: home.certifications.map((cert) => ({
          '@type': 'EducationalOccupationalCredential',
          name: cert.name,
          credentialCategory: 'certificate',
          recognizedBy: { '@type': 'Organization', name: cert.issuer },
        })),
        sameAs: contactChannels.filter((channel) => channel.kind === 'profile').map((channel) => channel.href),
      },
    ],
  }
}

/** The home page's FAQ, exactly as shown on the page (Google ignores FAQ markup for questions it can't see). */
export function faqJsonLd(items: FaqItem[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${absoluteUrl('/', locale)}#faq`,
    inLanguage: locale,
    isPartOf: website,
    about: { '@id': personId },
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
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
    isPartOf: website,
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
    isPartOf: website,
    genre: project.kind,
    creator: person,
    image: project.cover?.url,
    dateCreated: project.startedAt?.slice(0, 10),
    // Display names, not the stored ids ("Next.js", not "nextjs").
    keywords: project.stack.map((id) => findStackTool(id)?.name ?? id).join(', ') || undefined,
    // The product itself, live on its own domain.
    about: project.liveUrl ? { '@type': 'WebSite', name: project.title, url: project.liveUrl } : undefined,
  }
}
