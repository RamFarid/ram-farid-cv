import 'server-only'
import { cache } from 'react'
import { differenceInCalendarDays } from 'date-fns'
import { findProfile, setProfileCv } from '@/lib/db/profile'
import type { CvFile, CvInput } from '@/lib/validations/profile'
import type { ContactChannel } from './types'

// Facts about Ram shown across the site. Figures are never typed into copy; see docs/project.md#identity
// The About copy, client count, services, skills and certificates moved to the console (docs/console.md#home-content).

export const careerStart = new Date(Date.UTC(2021, 10, 13))

// TODO(Ram): confirm whether to show "Available for work" (docs/home.md#waiting-on-ram).
export const isAvailableForWork = true

/** Years since `careerStart`, to one decimal (4.9 on 2026-10-03). */
export function getYearsOfExperience(now = new Date()) {
  return Math.round((differenceInCalendarDays(now, careerStart) / 365.2425) * 10) / 10
}

/** The CV's public R2 URL, uploaded from the console; null until there is one. See docs/console.md#cv */
export const getCvUrl = cache(async () => (await findProfile())?.cv?.url ?? null)

export async function getConsoleCv(): Promise<CvInput> {
  const cv = (await findProfile())?.cv
  return {
    cv: cv ? { url: cv.url, name: cv.name, size: cv.size, uploadedAt: cv.uploadedAt.toISOString() } : null,
  }
}

/** Sets or removes the CV and returns the R2 file it replaced, for the caller to delete after responding. */
export async function setCv(cv: CvFile | null) {
  const previous = await setProfileCv(cv ? { ...cv, uploadedAt: new Date(cv.uploadedAt) } : undefined)
  const old = previous?.cv?.url
  return old && old !== cv?.url ? [old] : []
}

// Confirmed by Ram on 2026-10-04. Direct channels first; the footer keeps GitHub, Email and WhatsApp. See docs/contact.md#channels
export const contactChannels: ContactChannel[] = [
  { id: 'email', kind: 'direct', href: 'mailto:ram@ramfarid.com', handle: 'ram@ramfarid.com', footer: true },
  { id: 'whatsapp', kind: 'direct', href: 'https://wa.me/201553706448', handle: '+20 155 370 6448', footer: true },
  { id: 'messenger', kind: 'direct', href: 'https://m.me/ramfarid22', handle: 'ramfarid22' },
  { id: 'github', kind: 'profile', href: 'https://github.com/RamFarid', handle: 'RamFarid', footer: true },
  { id: 'facebook', kind: 'profile', href: 'https://www.facebook.com/ramfarid22', handle: 'ramfarid22' },
  { id: 'instagram', kind: 'profile', href: 'https://www.instagram.com/ramfarid22', handle: '@ramfarid22' },
]
