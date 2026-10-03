import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { NavBar, type NavLink } from '@/components/ui/NavBar'
import { CvButton } from './CvButton'
import { LocaleSwitch } from './LocaleSwitch'
import { NavMenu } from './NavMenu'

// The home page's sections, in page order. See docs/home.md#structure-work-first-in-project-bands
const sections = ['work', 'about', 'services', 'skills', 'contact'] as const

export function SiteHeader() {
  const t = useTranslations('Nav')
  const links: NavLink[] = sections.map((section) => ({ label: t(section), href: `#${section}` }))

  return (
    <header className="fixed inset-x-0 top-space-4 z-40">
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-space-4 py-space-2 text-label text-on-primary focus:not-sr-only focus:absolute focus:start-space-4 focus:top-0"
      >
        {t('skip')}
      </a>
      <Container>
        <NavBar
          name="Ram"
          homeLabel={t('home')}
          links={links}
          ariaLabel={t('label')}
          action={
            <>
              <LocaleSwitch />
              <CvButton size="sm" className="hidden md:inline-flex" />
            </>
          }
          menu={<NavMenu links={links} label={t('menu')} footer={<CvButton />} />}
        />
      </Container>
    </header>
  )
}
