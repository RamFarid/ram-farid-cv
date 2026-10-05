import 'server-only'
import { getFormatter, getTranslations } from 'next-intl/server'
import { findHomeContent } from '@/lib/db/home'
import { findProfile, setProfileCv } from '@/lib/db/profile'
import { findCvProjects } from '@/lib/db/projects'
import { contactChannels, education, educationStart, getStudyYear, getYearsOfExperience, spokenLanguages } from '@/lib/profile'
import { siteUrl } from '@/lib/seo/site'
import {
  cvContactIds,
  cvFileName,
  cvSectionIds,
  CV_YEARS_PLACEHOLDER,
  type CvConfigInput,
  type CvContactId,
  type CvSectionId,
} from '@/lib/validations/cv'
import { renderCvPdf } from './pdf'
import type { ContactChannel } from '@/lib/profile/types'
import type { CvBlock, CvDocument, CvEntry, CvSources } from './types'

// The CV builder: the setup saved in the console plus the site's content, resolved into one English CV and rendered
// as a PDF. The public CV (/api/cv) and the console's one-time download share every step. See docs/cv.md

/** The setup before anything is saved: every section and contact on, nothing picked. The seed stores Ram's real one. */
const emptyConfig: CvConfigInput = {
  headline: '',
  tools: [],
  summary: '',
  contacts: [...cvContactIds],
  sections: cvSectionIds.map((id) => ({ id, visible: true })),
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  pageSize: 'A4',
}

/** Everything the CV can pick from, in English. */
export async function getCvSources(): Promise<CvSources> {
  const [home, projects] = await Promise.all([findHomeContent(), findCvProjects()])

  return {
    experience: (home?.experience ?? [])
      .map((entry) => ({
        id: entry.id,
        role: entry.role.en,
        organization: entry.organization,
        url: entry.url || undefined,
        startedOn: entry.startedOn,
        endedOn: entry.endedOn || undefined,
        summary: entry.summary.en,
        highlights: (entry.highlights ?? []).map((highlight) => ({ id: highlight.id, text: highlight.text.en })),
      }))
      .sort((a, b) => b.startedOn.localeCompare(a.startedOn)),
    projects: projects.map((project) => ({
      id: project._id.toString(),
      title: project.title.en,
      status: project.status,
      liveUrl: project.liveUrl || undefined,
      repoUrl: project.repoUrl || undefined,
    })),
    skillGroups: (home?.skillGroups ?? []).map((group) => ({
      id: group.id,
      name: group.name.en,
      items: group.items ?? [],
      practices: (group.practices ?? []).map((practice) => ({ id: practice.id, label: practice.label.en })),
    })),
    certifications: (home?.certifications ?? []).map((cert) => ({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      issuedOn: cert.issuedOn || undefined,
    })),
  }
}

/**
 * The setup lined up with today's content: references to deleted roles, projects, groups and certificates are dropped,
 * every current role gets a row (main, all highlights, until set otherwise), and every section has a place.
 */
export function normalizeCvConfig(config: CvConfigInput, sources: CvSources): CvConfigInput {
  const projectIds = new Set(sources.projects.map((project) => project.id))
  const groups = new Map(sources.skillGroups.map((group) => [group.id, group]))
  const certIds = new Set(sources.certifications.map((cert) => cert.id))
  const sections = config.sections.filter(
    (section, index) => cvSectionIds.includes(section.id) && config.sections.findIndex((other) => other.id === section.id) === index,
  )

  return {
    ...config,
    contacts: cvContactIds.filter((id) => config.contacts.includes(id)),
    sections: [
      ...sections,
      ...cvSectionIds.filter((id) => !sections.some((section) => section.id === id)).map((id) => ({ id, visible: true })),
    ],
    experience: sources.experience.map((role) => {
      const saved = config.experience.find((entry) => entry.id === role.id)
      const highlightIds = new Set(role.highlights.map((highlight) => highlight.id))
      return {
        id: role.id,
        tier: saved?.tier ?? 'main',
        hiddenHighlights: (saved?.hiddenHighlights ?? []).filter((id) => highlightIds.has(id)),
      }
    }),
    projects: config.projects.filter((project) => projectIds.has(project.projectId)),
    skills: config.skills.flatMap((entry) => {
      const group = groups.get(entry.groupId)
      if (!group) return []
      const practiceIds = new Set(group.practices.map((practice) => practice.id))
      return [
        {
          ...entry,
          hiddenItems: entry.hiddenItems.filter((item) => group.items.includes(item)),
          hiddenPractices: entry.hiddenPractices.filter((id) => practiceIds.has(id)),
        },
      ]
    }),
    certifications: config.certifications.filter((id) => certIds.has(id)),
  }
}

/** The saved setup and what it picks from, for the console and the public CV. */
export async function getCvSetup() {
  const [profile, sources] = await Promise.all([findProfile(), getCvSources()])
  const saved = profile?.cv
  const config: CvConfigInput = saved
    ? {
        headline: saved.headline,
        tools: saved.tools ?? [],
        summary: saved.summary ?? '',
        contacts: (saved.contacts ?? []) as CvContactId[],
        sections: (saved.sections ?? []).map((section) => ({ id: section.id as CvSectionId, visible: section.visible })),
        experience: (saved.experience ?? []).map((entry) => ({
          id: entry.id,
          tier: entry.tier,
          hiddenHighlights: entry.hiddenHighlights ?? [],
        })),
        projects: (saved.projects ?? []).map((project) => ({
          projectId: project.projectId,
          title: project.title ?? '',
          links: project.links ?? [],
          bullets: (project.bullets ?? []).map((bullet) => ({ id: bullet.id, text: bullet.text })),
        })),
        skills: (saved.skills ?? []).map((group) => ({
          groupId: group.groupId,
          label: group.label ?? '',
          hiddenItems: group.hiddenItems ?? [],
          hiddenPractices: group.hiddenPractices ?? [],
        })),
        certifications: saved.certifications ?? [],
        pageSize: saved.pageSize ?? 'A4',
      }
    : emptyConfig

  return { config: normalizeCvConfig(config, sources), sources }
}

export async function saveCvConfig(config: CvConfigInput) {
  await setProfileCv(config)
}

const linkText = (url: string) => url.replace(/^[a-z]+:(\/\/)?(www\.)?/, '').replace(/\/$/, '')

/** `YYYY-MM` as the first moment of that month, in UTC like every date on the site. */
const month = (value: string) => {
  const [year, monthNumber] = value.split('-').map(Number)
  return new Date(Date.UTC(year, monthNumber - 1, 1))
}

/** Each contact as the CV writes it, or null when its channel is gone. */
export async function getCvContacts(): Promise<Record<CvContactId, { text: string; href?: string } | null>> {
  const tProfile = await getTranslations({ locale: 'en', namespace: 'Profile' })
  const profile = (id: ContactChannel['id']) => {
    const channel = contactChannels.find((item) => item.id === id)
    return channel ? { text: linkText(channel.href), href: channel.href } : null
  }
  const direct = (id: ContactChannel['id'], href: (handle: string) => string) => {
    const channel = contactChannels.find((item) => item.id === id)
    return channel ? { text: channel.handle, href: href(channel.handle) } : null
  }

  return {
    location: { text: tProfile('location.place') },
    phone: direct('whatsapp', (handle) => `tel:${handle.replace(/\s/g, '')}`),
    email: direct('email', (handle) => `mailto:${handle}`),
    website: { text: linkText(siteUrl), href: siteUrl },
    linkedin: profile('linkedin'),
    github: profile('github'),
  }
}

/** Resolves the setup against the site's content: the CV exactly as it will read. */
export async function buildCvDocument(config: CvConfigInput, sources: CvSources, now = new Date()): Promise<CvDocument> {
  const [t, tProfile, format] = await Promise.all([
    getTranslations({ locale: 'en', namespace: 'Cv' }),
    getTranslations({ locale: 'en', namespace: 'Profile' }),
    getFormatter({ locale: 'en' }),
  ])
  const monthYear = (date: Date) => format.dateTime(date, { month: 'short', year: 'numeric', timeZone: 'UTC' })
  const range = (start: Date, end: Date | null) => `${monthYear(start)} – ${end ? monthYear(end) : t('present')}`
  const contactValues = await getCvContacts()

  const roleEntries = (tier: 'main' | 'additional'): CvEntry[] =>
    sources.experience.flatMap((role) => {
      const setup = config.experience.find((entry) => entry.id === role.id)
      if ((setup?.tier ?? 'main') !== tier) return []
      return [
        {
          heading: `${role.role} | ${role.organization}`,
          dates: range(month(role.startedOn), role.endedOn ? month(role.endedOn) : null),
          links: role.url ? [{ text: linkText(role.url), href: role.url }] : [],
          text: role.summary || undefined,
          bullets: role.highlights
            .filter((highlight) => !setup?.hiddenHighlights.includes(highlight.id))
            .map((highlight) => highlight.text),
        },
      ]
    })

  const studyYear = getStudyYear(now)
  const block = (id: CvSectionId): CvBlock | null => {
    const heading = t(`sections.${id}`)
    switch (id) {
      case 'summary': {
        const years = String(Math.floor(getYearsOfExperience(now)))
        const paragraphs = config.summary
          .replaceAll(CV_YEARS_PLACEHOLDER, years)
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.replace(/\s*\n\s*/g, ' ').trim())
          .filter(Boolean)
        return paragraphs.length ? { id, heading, paragraphs } : null
      }
      case 'skills': {
        const groups = config.skills.flatMap((entry) => {
          const group = sources.skillGroups.find((item) => item.id === entry.groupId)
          if (!group) return []
          const items = [
            ...group.items.filter((item) => !entry.hiddenItems.includes(item)),
            ...group.practices.filter((practice) => !entry.hiddenPractices.includes(practice.id)).map((practice) => practice.label),
          ]
          return items.length ? [{ label: entry.label || group.name, items }] : []
        })
        return groups.length ? { id, heading, groups } : null
      }
      case 'experience':
      case 'additionalExperience': {
        const entries = roleEntries(id === 'experience' ? 'main' : 'additional')
        return entries.length ? { id, heading, entries } : null
      }
      case 'projects': {
        const entries = config.projects.flatMap((entry) => {
          const project = sources.projects.find((item) => item.id === entry.projectId)
          if (!project) return []
          return [
            {
              heading: entry.title || project.title,
              links: entry.links.map((url) => ({ text: linkText(url), href: url })),
              bullets: entry.bullets.map((bullet) => bullet.text),
            },
          ]
        })
        return entries.length ? { id, heading, entries } : null
      }
      case 'certifications': {
        const entries = config.certifications.flatMap((certId) => {
          const cert = sources.certifications.find((item) => item.id === certId)
          if (!cert) return []
          return [{ heading: `${cert.name} | ${cert.issuer}`, dates: cert.issuedOn ? monthYear(month(cert.issuedOn)) : undefined, links: [], bullets: [] }]
        })
        return entries.length ? { id, heading, entries } : null
      }
      case 'education': {
        // Graduation is never stated ahead of time (docs/home.md#location-education-and-languages): "Expected" until then.
        if (educationStart > now) return null
        const graduation = monthYear(education.graduation)
        return {
          id,
          heading,
          entries: [
            {
              heading: `${tProfile('education.field')} | ${tProfile('education.university')}`,
              dates: `${monthYear(educationStart)} – ${studyYear === null ? graduation : t('expected', { date: graduation })}`,
              links: [],
              text: [
                tProfile('education.formerly'),
                tProfile('location.place'),
                studyYear !== null && tProfile('education.studyYear', { year: studyYear }),
              ]
                .filter(Boolean)
                .join(' · '),
              bullets: [],
            },
          ],
        }
      }
      case 'languages':
        return {
          id,
          heading,
          items: spokenLanguages.map((language) =>
            t('language', { name: tProfile(`languages.${language.id}`), level: tProfile(`languages.levels.${language.level}`) }),
          ),
        }
    }
  }

  const skillWords = config.skills.flatMap((entry) => {
    const group = sources.skillGroups.find((item) => item.id === entry.groupId)
    return group ? group.items.filter((item) => !entry.hiddenItems.includes(item)) : []
  })

  return {
    name: t('name'),
    headline: config.headline,
    tools: config.tools,
    contacts: config.contacts.flatMap((id) => {
      const value = contactValues[id]
      return value ? [{ id, ...value }] : []
    }),
    blocks: config.sections.flatMap((section) => {
      const built = section.visible ? block(section.id) : null
      return built ? [built] : []
    }),
    pageSize: config.pageSize,
    title: t('documentTitle', { name: t('name') }),
    subject: config.headline,
    keywords: [...new Set([...config.tools, ...skillWords])],
  }
}

/** Renders a CV and names its file; `company` only changes the name of a one-time CV. */
export async function renderCv(config: CvConfigInput, sources: CvSources, company = '') {
  const document = await buildCvDocument(normalizeCvConfig(config, sources), sources)
  const { pdf, pages } = await renderCvPdf(document)
  return { pdf, pages, fileName: cvFileName(company) }
}

/** The public CV, from the saved setup. */
export async function getPublicCv() {
  const { config, sources } = await getCvSetup()
  return renderCv(config, sources)
}
