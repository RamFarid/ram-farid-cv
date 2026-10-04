'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import Image from 'next/image'
import { useAtomValue } from 'jotai'
import { ExternalLink, FolderKanban, House, LogOut, Mail } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { signOut } from '@/lib/auth/actions'
import { dirtySectionsAtom } from '@/lib/state/console'
import type { HomeSection } from '@/lib/validations/home'
import { cn } from '@/utils'

// The console's navigation: the three managers, and on the home page its sections in home-page order with a dot on
// each one holding unsaved edits. A sticky side rail from lg, a top bar under it. See docs/console.md#layout

type ConsoleRailProps = {
  newMessages: number
  projects: { published: number; draft: number }
}

const sections: { id: HomeSection; index: string }[] = [
  { id: 'about', index: '02' },
  { id: 'services', index: '03' },
  { id: 'skills', index: '04' },
  { id: 'certifications', index: '05' },
]

const itemClasses =
  'flex h-10 items-center gap-space-3 rounded-md px-space-3 text-label text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink aria-[current=page]:bg-primary-soft aria-[current=page]:text-primary-ink'

/** The last section whose top has passed the upper third of the screen, for the rail's current marker. */
function useSectionInView(enabled: boolean) {
  const [inView, setInView] = useState<HomeSection>('about')

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const measure = () => {
      frame = 0
      const line = window.innerHeight / 3
      let current: HomeSection = 'about'
      for (const { id } of sections) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= line) current = id
      }
      setInView(current)
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(measure)
    }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [enabled])

  return inView
}

export function ConsoleRail({ newMessages, projects }: ConsoleRailProps) {
  const t = useTranslations('Console.rail')
  const tSections = useTranslations('Console')
  const locale = useLocale()
  const pathname = usePathname()
  const dirty = useAtomValue(dirtySectionsAtom)
  const onHome = pathname === '/console'
  const inView = useSectionInView(onHome)
  const other = locale === 'en' ? 'ar' : 'en'
  // Drafts live in component state, and a client-side navigation would drop them without the browser's leave-page
  // prompt. While anything is unsaved, links navigate the whole document so that prompt can step in.
  const guard = (event: MouseEvent<HTMLAnchorElement>) => {
    if (dirty.size === 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
    event.preventDefault()
    window.location.assign(event.currentTarget.href)
  }

  const managers = [
    { href: '/console', label: t('home'), icon: House, meta: null },
    {
      href: '/console/contact-msgs',
      label: t('messages'),
      icon: Mail,
      meta: newMessages > 0 ? t('newMessages', { count: newMessages }) : null,
    },
    {
      href: '/console/portfolio',
      label: t('projects'),
      icon: FolderKanban,
      meta: t('projectCounts', { published: projects.published, draft: projects.draft }),
    },
  ] as const

  return (
    <div className="flex h-full flex-col gap-space-5 lg:gap-space-6">
      <div className="flex items-center gap-space-3">
        <Link href="/console" onClick={guard} className="inline-flex items-center gap-2.5 rounded-sm text-h3 leading-none font-bold tracking-[-0.03em] text-logo-word">
          <Image src="/brand/ram-icon.svg" alt="" width={28} height={28} />
          {t('name')}
        </Link>
        <span className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-code text-ink-muted">{t('badge')}</span>
      </div>

      <nav aria-label={t('label')} className="flex flex-wrap gap-space-1 lg:grid">
        {managers.map(({ href, label, icon: Icon, meta }) => (
          <div key={href} className="grid shrink-0 gap-space-1">
            <Link href={href} onClick={guard} aria-current={pathname === href ? 'page' : undefined} className={itemClasses}>
              <Icon aria-hidden size={18} strokeWidth={1.75} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {meta && (
                <span className={cn('font-mono text-code tabular-nums', href === '/console/contact-msgs' ? 'text-ink' : 'text-ink-muted')}>
                  {meta}
                </span>
              )}
            </Link>

            {href === '/console' && onHome && (
              <ul className="grid gap-px border-s border-line ms-space-5 ps-space-2 max-lg:hidden">
                {sections.map(({ id, index }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      aria-current={inView === id ? 'location' : undefined}
                      className="flex h-9 items-center gap-space-3 rounded-md px-space-3 text-small text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink aria-[current=location]:text-ink"
                    >
                      <span className="font-mono text-code tabular-nums">{index}</span>
                      <span className="flex-1">{tSections(`${id}.title`)}</span>
                      {dirty.has(id) && (
                        <span className="size-1.5 rounded-full bg-warning">
                          <span className="sr-only">{t('unsaved')}</span>
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>

      {onHome && (
        <ul aria-label={t('sections')} className="-mx-space-1 flex gap-space-1 overflow-x-auto px-space-1 lg:hidden">
          {sections.map(({ id, index }) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                className="flex h-9 items-center gap-space-2 rounded-md border border-line px-space-3 text-small text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink"
              >
                <span className="font-mono text-code tabular-nums">{index}</span>
                {tSections(`${id}.title`)}
                {dirty.has(id) && (
                  <span className="size-1.5 rounded-full bg-warning">
                    <span className="sr-only">{t('unsaved')}</span>
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap gap-space-1 border-t border-line pt-space-4 max-lg:pt-space-3 lg:grid">
        <a href={`/${locale}`} target="_blank" rel="noreferrer" className={itemClasses}>
          <ExternalLink aria-hidden size={18} strokeWidth={1.75} className="shrink-0" />
          {t('viewSite')}
          <span className="sr-only">{t('newTab')}</span>
        </a>
        <Link href={pathname} locale={other} hrefLang={other} onClick={guard} className={itemClasses}>
          <span aria-hidden className="inline-flex w-4.5 justify-center font-mono text-code">
            {other.toUpperCase()}
          </span>
          <span lang={other}>{t('switchLocale')}</span>
        </Link>
        <form action={signOut.bind(null, locale)}>
          <button type="submit" className={cn(itemClasses, 'w-full')}>
            <LogOut aria-hidden size={18} strokeWidth={1.75} className="shrink-0 rtl:-scale-x-100" />
            {t('signOut')}
          </button>
        </form>
      </div>
    </div>
  )
}
