// A project as the public site shows it: localized fields already resolved to one locale.
export type PublicProject = {
  slug: string
  title: string
  client: string
  kind: string
  summary: string
  year?: number
  stack: string[]
  liveUrl?: string
  cover?: {
    url: string
    width: number
    height: number
    alt: string
  }
}
