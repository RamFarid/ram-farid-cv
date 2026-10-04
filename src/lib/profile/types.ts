export type ContactChannel = {
  /** Also the key of its name in messages (`Common.channels.<id>`). */
  id: 'email' | 'whatsapp' | 'linkedin' | 'github' | 'facebook' | 'instagram'
  href: string
  /** What the visitor would type to reach Ram there: the address, number or username. Latin script in both languages. */
  handle: string
  /** `profile`: a public profile of Ram's (opens in a new tab, `rel="me"`, `sameAs` in JSON-LD). `direct`: a way to message him. */
  kind: 'direct' | 'profile'
  /** Also listed in the site footer. */
  footer?: boolean
}

export type SpokenLanguage = {
  /** Also the key of its name in messages (`Profile.languages.<id>`). */
  id: 'ar' | 'en'
  /** The key of its level in messages (`Profile.languages.levels.<level>`). */
  level: 'native' | 'professional'
}
