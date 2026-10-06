import 'server-only'
import { getTranslations } from 'next-intl/server'
import { getHomeContent } from '@/lib/home'
import { getFaq } from '@/lib/home/faq'
import { contactChannels, formatWorkTypes, getAvailability } from '@/lib/profile'
import { getPortfolioProjects } from '@/lib/projects'
import { absoluteUrl } from './metadata'
import { siteUrl } from './site'

/**
 * /llms.txt (https://llmstxt.org): who Ram is and where the facts live, as Markdown for AI assistants and answer
 * engines. English only; it points to the Arabic pages. Every fact comes from messages, the home content, the projects
 * and lib/profile, so it can't drift from the site. The few headings are for machines, so they stay here rather than in
 * messages.
 * See docs/seo.md#llmstxt
 */
export async function buildLlmsTxt() {
  const locale = 'en'
  const [t, tIntro, tAvailability, tPortfolio, tChannels, projects, availability, home] = await Promise.all([
    getTranslations({ locale, namespace: 'Metadata' }),
    getTranslations({ locale, namespace: 'Home.intro' }),
    getTranslations({ locale, namespace: 'Profile.availability' }),
    getTranslations({ locale, namespace: 'Portfolio.metadata' }),
    getTranslations({ locale, namespace: 'Common.channels' }),
    getPortfolioProjects(locale),
    getAvailability(),
    getHomeContent(locale),
  ])
  const [types, faq] = await Promise.all([
    formatWorkTypes(availability, locale),
    getFaq({ locale, clients: home.about?.clientCount ?? 0, availability }),
  ])
  const availabilityLine = availability.length ? tAvailability('badge', { types }) : tAvailability('none')

  return [
    `# ${t('name')}`,
    '',
    `> ${t('description')}`,
    '',
    `${tIntro('lead')} ${availabilityLine}.`,
    '',
    `Every page is in English and Arabic: the Arabic version of a page is under ${siteUrl}/ar instead of ${siteUrl}/en.`,
    '',
    '## Pages',
    '',
    `- [${t('home')}](${absoluteUrl('/', locale)}): about, experience, services, skills, certificates and contact`,
    `- [${tPortfolio('title')}](${absoluteUrl('/portfolio', locale)}): ${tPortfolio('description')}`,
    `- [CV (PDF)](${siteUrl}/api/cv): generated from this site's content`,
    '',
    '## Projects',
    '',
    ...projects.map((project) => `- [${project.title}](${absoluteUrl(`/portfolio/${project.slug}`, locale)}): ${project.summary}`),
    '',
    '## FAQ',
    '',
    ...faq.flatMap((item) => [`### ${item.question}`, '', item.answer, '']),
    '## Contact',
    '',
    ...contactChannels.map((channel) => `- ${tChannels(channel.id)}: ${channel.kind === 'direct' ? channel.handle : channel.href}`),
    '',
  ].join('\n')
}
