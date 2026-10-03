import { differenceInCalendarDays } from 'date-fns'
import type { Certification, ContactChannel, SkillGroup } from './types'

// Facts about Ram shown across the site. Figures are never typed into copy; see docs/project.md#identity

export const careerStart = new Date(Date.UTC(2021, 10, 13))

export const clientCount = 16

// TODO(Ram): confirm whether to show "Available for work" (docs/home.md#waiting-on-ram).
export const isAvailableForWork = true

/** Years since `careerStart`, to one decimal (4.9 on 2026-10-03). */
export function getYearsOfExperience(now = new Date()) {
  return Math.round((differenceInCalendarDays(now, careerStart) / 365.2425) * 10) / 10
}

/** The CV file in R2. Until the console manages it, it comes from the CV_URL env var; unset means no CV yet. */
export function getCvUrl() {
  return process.env.CV_URL || null
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

// Confirmed by Ram on 2026-10-04.
export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    items: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'MUI', 'MUI X', 'shadcn/ui', 'Sass', 'styled-components', 'Framer Motion'],
  },
  { id: 'state', items: ['Redux Toolkit', 'Zustand', 'Jotai', 'TanStack Query', 'SWR'] },
  {
    id: 'backend',
    items: ['Node.js', 'Express.js', 'REST APIs', 'Socket.IO'],
    topics: ['backgroundJobs', 'cronJobs', 'workers'],
  },
  {
    id: 'data',
    items: ['MongoDB', 'Mongoose', 'PostgreSQL', 'MySQL', 'Prisma', 'Redis', 'Firebase', 'Supabase'],
    topics: ['databaseDesign', 'queryOptimization', 'transactions'],
  },
  { id: 'auth', items: ['Auth.js', 'JWT', 'OAuth', 'RBAC'], topics: ['authentication', 'authorization'] },
  {
    id: 'devops',
    items: ['Linux', 'Nginx', 'Docker', 'PM2', 'Coolify', 'GitHub Actions', 'Cloudflare', 'Vercel', 'AWS'],
  },
  { id: 'testing', items: ['Jest', 'Vitest', 'React Testing Library', 'Playwright', 'Cypress'] },
  { id: 'integrations', items: ['Stripe', 'Telegram Bot API', 'Nodemailer'] },
  { id: 'tools', items: ['Git', 'GitHub'] },
]

// TODO(Ram): replace with the real certificates. Put each image in public/certificates/<slug>.(png|jpg) and set its pixel size.
export const certifications: Certification[] = [
  {
    slug: 'todo-1',
    name: 'TODO: certificate name',
    issuer: 'TODO: issuer',
    description: { en: 'TODO: one sentence on what it covers', ar: 'TODO: جملة واحدة عمّا تغطيه' },
    skills: [],
  },
  {
    slug: 'todo-2',
    name: 'TODO: certificate name',
    issuer: 'TODO: issuer',
    description: { en: 'TODO: one sentence on what it covers', ar: 'TODO: جملة واحدة عمّا تغطيه' },
    skills: [],
  },
]
