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
