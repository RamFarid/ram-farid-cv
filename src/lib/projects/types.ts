import type { ProjectInput, ProjectStatus } from '@/lib/validations/project'

// Projects as the public site shows them: localized fields already resolved to one locale.

export type ProjectImage = {
  url: string
  width: number
  height: number
  alt: string
}

/** Just enough to make someone open the case study: the index frames and the next-project band. */
export type ProjectTeaser = {
  slug: string
  title: string
  kind: string
  summary: string
  year?: number
  cover?: ProjectImage
  /** Shown as "Recommended"; it doesn't change the order. */
  starred: boolean
}

/** A home-page band. */
export type PublicProject = ProjectTeaser & {
  client: string
  stack: string[]
  liveUrl?: string
}

export type ProjectScreenshot = ProjectImage & {
  device: 'desktop' | 'mobile'
  caption?: string
}

/** Everything on /portfolio/[project_id]. Dates are ISO strings so the type stays serializable. */
export type ProjectCaseStudy = PublicProject & {
  repoUrl?: string
  startedAt?: string
  /** Unset with `startedAt` set: the work is ongoing. */
  endedAt?: string
  role?: string
  overview?: string
  deliverables: string[]
  /** Sanitized HTML. See docs/portfolio.md#story-html */
  storyHtml?: string
  screenshots: ProjectScreenshot[]
}

// The console's view: both locales, drafts included. See docs/portfolio.md#console

/** One row of /console/portfolio. */
export type ConsoleProjectRow = {
  id: string
  slug: string
  title: { en: string; ar: string }
  kind: { en: string; ar: string }
  status: ProjectStatus
  starred: boolean
  year?: number
  cover?: Omit<ProjectImage, 'alt'>
}

/** /console/portfolio/[project_id]: the stored project as the edit page's draft. */
export type ConsoleProject = {
  id: string
  status: ProjectStatus
  input: ProjectInput
}

/** What the index's quick actions return. `missing` lists the dotted paths a project needs before it can go live. */
export type ProjectActionResult =
  | { ok: true }
  | { ok: false; error: 'unauthorized' | 'invalid' | 'unavailable' | 'notFound' }
  | { ok: false; error: 'incomplete'; missing: string[] }
