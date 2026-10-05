import type { CvContactId, CvPageSize, CvSectionId } from '@/lib/validations/cv'

// The CV builder's contracts. See docs/cv.md

/** The site content the CV setup picks from, in English. Plain data: the console's editor gets it too. */
export type CvSources = {
  /** The home page's roles, newest first. */
  experience: {
    id: string
    role: string
    organization: string
    url?: string
    startedOn: string
    endedOn?: string
    summary: string
    highlights: { id: string; text: string }[]
  }[]
  /** Every project, drafts included, in console order. */
  projects: { id: string; title: string; status: 'draft' | 'published'; liveUrl?: string; repoUrl?: string }[]
  skillGroups: { id: string; name: string; items: string[]; practices: { id: string; label: string }[] }[]
  certifications: { id: string; name: string; issuer: string; issuedOn?: string }[]
}

/** One dated block: a role, a project, a certificate or the degree. */
export type CvEntry = {
  /** "Founder and Full-Stack Engineer | Ramlyon". */
  heading: string
  dates?: string
  /** Shown as text (without the protocol) so a parser reads them; also clickable. */
  links: { text: string; href: string }[]
  /** A plain line under the heading, before the bullets. */
  text?: string
  bullets: string[]
}

export type CvBlock =
  | { id: 'summary'; heading: string; paragraphs: string[] }
  | { id: 'skills'; heading: string; groups: { label: string; items: string[] }[] }
  | { id: 'languages'; heading: string; items: string[] }
  | { id: Exclude<CvSectionId, 'summary' | 'skills' | 'languages'>; heading: string; entries: CvEntry[] }

/** The CV with every fact resolved, ready to lay out. */
export type CvDocument = {
  name: string
  headline: string
  tools: string[]
  contacts: { id: CvContactId; text: string; href?: string }[]
  blocks: CvBlock[]
  pageSize: CvPageSize
  /** PDF metadata. */
  title: string
  subject: string
  keywords: string[]
}
