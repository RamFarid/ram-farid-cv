import 'server-only'
import { cache } from 'react'
import type { Locale } from 'next-intl'
import { findHomeContent, updateHomeContent } from '@/lib/db/home'
import { findPublishedSlugsByIds } from '@/lib/db/projects'
import type { HomeContentRecord } from '@/lib/db/models/HomeContent'
import { deleteObjects } from '@/lib/storage'
import type { HomeContentInput, HomeSection } from '@/lib/validations/home'
import type { HomeContent, HomeImage } from './types'

// The home page's editable content: read per locale for the public page, in full for the console.
// See docs/console.md#home-content

type ImageRecord = { url: string; width: number; height: number } | null | undefined

function toImage(image: ImageRecord): HomeImage | undefined {
  return image ? { url: image.url, width: image.width, height: image.height } : undefined
}

/** Blank lines split paragraphs. */
function toParagraphs(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

/** The home page's content in one locale. Empty before the seed has run, so the page hides those sections. */
export const getHomeContent = cache(async (locale: Locale): Promise<HomeContent> => {
  const record = await findHomeContent()
  if (!record) return { about: null, experience: [], services: [], skillGroups: [], certifications: [] }
  const experience = record.experience ?? []
  const slugs = await findPublishedSlugsByIds(experience.flatMap((entry) => (entry.projectId ? [entry.projectId] : [])))

  // Lean reads skip schema defaults, so arrays added later may be missing. See docs/database.md
  return {
    about: record.about
      ? {
          title: record.about.title[locale],
          paragraphs: toParagraphs(record.about.body[locale]),
          clientCount: record.about.clientCount,
          portrait: toImage(record.about.portrait),
        }
      : null,
    experience: experience
      .map((entry) => ({
        id: entry.id,
        role: entry.role[locale],
        organization: entry.organization,
        url: entry.url || undefined,
        startedOn: entry.startedOn,
        endedOn: entry.endedOn || undefined,
        summary: entry.summary[locale],
        highlights: (entry.highlights ?? []).map((highlight) => highlight.text[locale]),
        projectSlug: entry.projectId ? slugs.get(entry.projectId) : undefined,
      }))
      .sort((a, b) => a.startedOn.localeCompare(b.startedOn)),
    services: (record.services ?? []).map((service) => ({
      id: service.id,
      title: service.title[locale],
      body: service.body[locale],
    })),
    skillGroups: (record.skillGroups ?? []).map((group) => ({
      id: group.id,
      name: group.name[locale],
      items: group.items ?? [],
      practices: (group.practices ?? []).map((practice) => practice.label[locale]),
    })),
    certifications: (record.certifications ?? []).map((cert) => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      issuedOn: cert.issuedOn || undefined,
      description: cert.description[locale],
      skills: cert.skills ?? [],
      image: toImage(cert.image),
    })),
  }
})

const localizedPair = (value: { en: string; ar: string } | null | undefined) => ({ en: value?.en ?? '', ar: value?.ar ?? '' })
const imageOrNull = (image: ImageRecord) => toImage(image) ?? null

/** Everything the console edits, in both locales. Blank values stand in for content that doesn't exist yet. */
export async function getConsoleHomeContent(): Promise<HomeContentInput> {
  const record = await findHomeContent()

  return {
    about: {
      title: localizedPair(record?.about?.title),
      body: localizedPair(record?.about?.body),
      clientCount: record?.about?.clientCount ?? 0,
      portrait: imageOrNull(record?.about?.portrait),
    },
    experience: (record?.experience ?? []).map((entry) => ({
      id: entry.id,
      role: localizedPair(entry.role),
      organization: entry.organization,
      url: entry.url ?? '',
      startedOn: entry.startedOn,
      endedOn: entry.endedOn ?? '',
      summary: localizedPair(entry.summary),
      highlights: (entry.highlights ?? []).map((highlight) => ({ id: highlight.id, text: localizedPair(highlight.text) })),
      projectId: entry.projectId ?? '',
    })),
    services: (record?.services ?? []).map((service) => ({
      id: service.id,
      title: localizedPair(service.title),
      body: localizedPair(service.body),
    })),
    skillGroups: (record?.skillGroups ?? []).map((group) => ({
      id: group.id,
      name: localizedPair(group.name),
      items: group.items ?? [],
      practices: (group.practices ?? []).map((practice) => ({ id: practice.id, label: localizedPair(practice.label) })),
    })),
    certifications: (record?.certifications ?? []).map((cert) => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      issuedOn: cert.issuedOn ?? '',
      description: localizedPair(cert.description),
      skills: cert.skills ?? [],
      image: imageOrNull(cert.image),
    })),
  }
}

type SectionPatch =
  | { section: 'about'; value: HomeContentInput['about'] }
  | { section: 'experience'; value: HomeContentInput['experience'] }
  | { section: 'services'; value: HomeContentInput['services'] }
  | { section: 'skills'; value: HomeContentInput['skillGroups'] }
  | { section: 'certifications'; value: HomeContentInput['certifications'] }

/** Every image URL a section holds, so images replaced or removed by a save can be deleted from R2. */
function sectionImageUrls(section: HomeSection, record: Partial<HomeContentRecord> | null) {
  if (section === 'about') return record?.about?.portrait ? [record.about.portrait.url] : []
  if (section === 'certifications') {
    return (record?.certifications ?? []).flatMap((cert) => (cert.image ? [cert.image.url] : []))
  }
  return []
}

/**
 * Replaces one section of the home content and returns the R2 images that section no longer uses. The caller deletes
 * them after responding; an upload that was never saved stays in R2 (docs/console.md#uploads).
 */
export async function saveHomeSection(patch: SectionPatch) {
  const update =
    patch.section === 'about'
      ? { about: { ...patch.value, portrait: patch.value.portrait ?? undefined } }
      : patch.section === 'experience'
        ? {
            experience: patch.value.map((entry) => ({
              ...entry,
              url: entry.url || undefined,
              endedOn: entry.endedOn || undefined,
              projectId: entry.projectId || undefined,
            })),
          }
        : patch.section === 'services'
          ? { services: patch.value }
          : patch.section === 'skills'
            ? { skillGroups: patch.value }
            : {
                certifications: patch.value.map((cert) => ({
                  ...cert,
                  issuedOn: cert.issuedOn || undefined,
                  image: cert.image ?? undefined,
                })),
              }

  const previous = await updateHomeContent(update as Partial<HomeContentRecord>)
  const kept = new Set(sectionImageUrls(patch.section, update as Partial<HomeContentRecord>))
  return sectionImageUrls(patch.section, previous).filter((url) => !kept.has(url))
}

export function deleteUnusedImages(urls: string[]) {
  return deleteObjects(urls)
}
