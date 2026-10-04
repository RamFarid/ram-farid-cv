export type ContactChannel = {
  /** Also the key of its name in messages (`Common.channels.<id>`). */
  id: 'email' | 'whatsapp' | 'messenger' | 'github' | 'facebook' | 'instagram'
  href: string
  /** What the visitor would type to reach Ram there: the address, number or username. Latin script in both languages. */
  handle: string
  /** `profile`: a public profile of Ram's (opens in a new tab, `rel="me"`, `sameAs` in JSON-LD). `direct`: a way to message him. */
  kind: 'direct' | 'profile'
  /** Also listed in the site footer. */
  footer?: boolean
}
