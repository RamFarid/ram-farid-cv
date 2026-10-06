import 'server-only'
import type { Locale } from 'next-intl'
import { getFormatter, getTranslations } from 'next-intl/server'
import { formatWorkTypes, getYearsOfExperience } from '@/lib/profile'
import type { WorkType } from '@/lib/validations/profile'

// The home page's FAQ: copy in messages (`Home.faq.items`), facts filled in when the page renders, so no answer can
// state a stale figure or the wrong availability. See docs/home.md#faq
export const faqIds = [
  'who',
  'available',
  'projects',
  'languages',
  'stack',
  'experience',
  'abroad',
  'start',
  'hosting',
  'roles',
  'cost',
] as const

export type FaqItem = { id: (typeof faqIds)[number]; question: string; answer: string }

export async function getFaq({
  locale,
  clients,
  availability,
}: {
  locale: Locale
  clients: number
  availability: WorkType[]
}): Promise<FaqItem[]> {
  const roles = availability.filter((type) => type !== 'freelance')
  const [t, format, availabilityList, rolesList] = await Promise.all([
    getTranslations({ locale, namespace: 'Home.faq.items' }),
    getFormatter({ locale }),
    formatWorkTypes(availability, locale),
    formatWorkTypes(roles, locale),
  ])

  const values = {
    clients: format.number(clients),
    years: format.number(getYearsOfExperience(), { maximumFractionDigits: 1 }),
    availability: availabilityList,
    roles: rolesList,
  }
  // Picks the answer's variant. `available`: open to any work or not. `roles`: open to a job, freelance only, or nothing.
  const stateFor = (id: FaqItem['id']) => {
    if (id === 'available') return availability.length ? 'open' : 'closed'
    if (id === 'roles') return roles.length ? 'roles' : availability.includes('freelance') ? 'freelance' : 'none'
    return 'none'
  }

  return faqIds.map((id) => ({
    id,
    question: t(`${id}.q`),
    answer: t(`${id}.a`, { ...values, state: stateFor(id) }),
  }))
}
