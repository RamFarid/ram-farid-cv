import 'server-only'
import { differenceInCalendarDays, subYears } from 'date-fns'
import type { ContactChannel, SpokenLanguage } from './types'

// Facts about Ram shown across the site. Figures are never typed into copy; see docs/project.md#identity
// The About copy, client count, services, skills and certificates moved to the console (docs/console.md#home-content).

export const careerStart = new Date(Date.UTC(2021, 10, 13))

// Confirmed by Ram on 2026-10-06.
export const isAvailableForWork = true

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
