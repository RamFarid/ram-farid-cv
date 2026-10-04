import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { ConsoleClient } from '@/components/Console/ConsoleClient'
import { ConsoleRail } from '@/components/Console/ConsoleRail'
import { routing } from '@/i18n/routing'
import { requireSession } from '@/lib/auth/session'
import { getConsoleCounts } from '@/lib/console'

// The signed-in console: the rail on the start side, the page on the end side. See docs/console.md#layout
export default async function ConsoleLayout({ children, params }: LayoutProps<'/[locale]/console'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  await requireSession(locale)
  const counts = await getConsoleCounts()

  return (
    <ConsoleClient>
      <div className="min-h-svh lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
        <aside className="border-b border-line bg-surface px-space-4 py-space-4 lg:sticky lg:top-0 lg:h-svh lg:overflow-y-auto lg:border-e lg:border-b-0 lg:px-space-4 lg:py-space-6">
          <ConsoleRail newMessages={counts.newMessages} projects={counts.projects} />
        </aside>
        <main id="main" className="min-w-0 px-space-4 pb-space-9 md:px-space-6 lg:px-space-7">
          {children}
        </main>
      </div>
    </ConsoleClient>
  )
}
