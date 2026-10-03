import type { Locale } from 'next-intl'

export type SocialLink = {
  id: 'github' | 'linkedin' | 'whatsapp' | 'instagram'
  /** The platform's own name, the same in both languages. */
  label: string
  href: string
}

export type SkillGroup = {
  /** Key of the group's name in messages (`Home.skills.groups.<id>`). */
  id: 'frontend' | 'state' | 'backend' | 'data' | 'auth' | 'devops' | 'testing' | 'integrations' | 'tools'
  /** Tech names written as their projects write them; the same in both languages. */
  items: string[]
  /** Practices rather than products, translated (`Home.skills.topics.<key>`). */
  topics?: SkillTopic[]
}

export type SkillTopic =
  | 'backgroundJobs'
  | 'cronJobs'
  | 'workers'
  | 'databaseDesign'
  | 'queryOptimization'
  | 'transactions'
  | 'authentication'
  | 'authorization'

export type Certification = {
  /** Stable key; also the image file name under public/certificates/. */
  slug: string
  /** The certificate's own title, as issued (not translated). */
  name: string
  issuer: string
  /** `YYYY-MM`. */
  issuedOn?: string
  /** One sentence on what it covers, per locale. */
  description: Record<Locale, string>
  /** Tech names, as their projects write them. Up to four. */
  skills: string[]
  /** The certificate itself. Without it the gallery shows a placeholder mat and no viewer. */
  image?: { src: string; width: number; height: number }
}
