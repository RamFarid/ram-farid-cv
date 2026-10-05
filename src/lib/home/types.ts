/** An image in R2 with its pixel size, for next/image. */
export type HomeImage = { url: string; width: number; height: number }

/** The About section in one locale. `paragraphs` may contain the `{clients}` placeholder; the page fills it in. */
export type HomeAbout = {
  title: string
  paragraphs: string[]
  clientCount: number
  portrait?: HomeImage
}

/** A role on the experience timeline, in one locale. Dates are `YYYY-MM`; no `endedOn` means ongoing. */
export type HomeExperience = {
  id: string
  role: string
  organization: string
  url?: string
  startedOn: string
  endedOn?: string
  summary: string
  highlights: string[]
  /** The linked case study, when its project is published. */
  projectSlug?: string
}

export type HomeService = { id: string; title: string; body: string }

export type HomeSkillGroup = {
  id: string
  name: string
  /** Tech names, the same in both languages. */
  items: string[]
  /** Translated practices. */
  practices: string[]
}

export type HomeCertification = {
  id: string
  name: string
  issuer: string
  /** `YYYY-MM`. */
  issuedOn?: string
  description: string
  skills: string[]
  image?: HomeImage
}

/** The home page's editable content, resolved to one locale. */
export type HomeContent = {
  about: HomeAbout | null
  /** In date order, oldest first. */
  experience: HomeExperience[]
  services: HomeService[]
  skillGroups: HomeSkillGroup[]
  certifications: HomeCertification[]
}
