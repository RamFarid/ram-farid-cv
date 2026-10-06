import 'server-only'
import { cache } from 'react'
import { differenceInCalendarDays, subYears } from 'date-fns'
import type { Locale } from 'next-intl'
import { getFormatter, getTranslations } from 'next-intl/server'
import { findProfile } from '@/lib/db/profile'
import { workTypes, type WorkType } from '@/lib/validations/profile'
import type { ContactChannel, SpokenLanguage } from './types'

// Facts about Ram shown across the site. Figures are never typed into copy; see docs/project.md#identity
// The About copy, client count, services, skills and certificates moved to the console (docs/console.md#home-content).

export const careerStart = new Date(Date.UTC(2021, 10, 13))

// Until the console's availability is first saved: what the site said when the setting was added (Ram takes client
// projects and applies for roles). See docs/console.md#availability
const defaultWorkTypes: WorkType[] = ['freelance', 'fullTime']

/** The kinds of work Ram is open to, in the site's order. Empty means not taking new work. */
export const getAvailability = cache(async (): Promise<WorkType[]> => {
  const profile = await findProfile()
  if (!profile?.availability) return defaultWorkTypes
  const picked = profile.availability.workTypes ?? []
  return workTypes.filter((type) => picked.includes(type))
})

/** Kinds of work as a list in one locale's words: "freelance and full-time" / "للعمل الحر ولوظيفة بدوام كامل". */
export async function formatWorkTypes(types: WorkType[], locale: Locale) {
  const [t, format] = await Promise.all([
    getTranslations({ locale, namespace: 'Profile.availability' }),
    getFormatter({ locale }),
  ])
  return format.list(
    types.map((type) => t(`types.${type}`)),
    { type: 'conjunction' },
  )
}

/** The console's availability: what the site uses now, and whether it was ever saved (or is still the default). */
export async function getConsoleAvailability() {
  const [profile, current] = await Promise.all([findProfile(), getAvailability()])
  return { initial: { workTypes: current }, saved: Boolean(profile?.availability) }
}

/** Years since `careerStart`, to one decimal (4.9 on 2026-10-03). */
export function getYearsOfExperience(now = new Date()) {
  return Math.round((differenceInCalendarDays(now, careerStart) / 365.2425) * 10) / 10
}

// Confirmed by Ram on 2026-10-05: four study years, each starting on 21 July, the last ending with graduation on
// 21 July 2028. The names are in messages (`Profile.education`). See docs/home.md#location-education-and-languages
export const education = { years: 4, graduation: new Date(Date.UTC(2028, 6, 21)) }

/** The first study year began on 21 July 2024. The experience timeline starts the university there. */
export const educationStart = subYears(education.graduation, education.years)

/** The current study year (1 to 4), or null once graduated. Computed on render, like the years figure. */
export function getStudyYear(now = new Date()) {
  if (now >= education.graduation) return null
  // Years 2 to 4 start on the anniversaries before graduation: 21 July 2025, 2026 and 2027.
  const laterYearStarts = Array.from({ length: education.years - 1 }, (_, index) => subYears(education.graduation, index + 1))
  return 1 + laterYearStarts.filter((start) => now >= start).length
}

// Where Ram is based, for structured data (ISO 3166 country). The visible wording is in messages (`Profile.location`).
export const homeLocation = { city: 'Cairo', country: 'EG' } as const

// Fixed (Ram, 2026-10-05). Names and levels are in messages (`Profile.languages`).
export const spokenLanguages: SpokenLanguage[] = [
  { id: 'ar', level: 'native' },
  { id: 'en', level: 'professional' },
]

// Confirmed by Ram on 2026-10-04; LinkedIn replaced Messenger on 2026-10-05 (the CV links it). Direct channels first; the
// footer keeps GitHub, Email and WhatsApp. See docs/contact.md#channels
export const contactChannels: ContactChannel[] = [
  { id: 'email', kind: 'direct', href: 'mailto:ram@ramfarid.com', handle: 'ram@ramfarid.com', footer: true },
  { id: 'whatsapp', kind: 'direct', href: 'https://wa.me/201553706448', handle: '+20 155 370 6448', footer: true },
  { id: 'linkedin', kind: 'profile', href: 'https://www.linkedin.com/in/ramfarid', handle: 'ramfarid' },
  { id: 'github', kind: 'profile', href: 'https://github.com/RamFarid', handle: 'RamFarid', footer: true },
  { id: 'facebook', kind: 'profile', href: 'https://www.facebook.com/ramfarid22', handle: 'ramfarid22' },
  { id: 'instagram', kind: 'profile', href: 'https://www.instagram.com/ramfarid22', handle: '@ramfarid22' },
]
