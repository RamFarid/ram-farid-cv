import type { Metadata } from 'next'
import { MailOpen } from 'lucide-react'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inbox } from '@/components/Console/Messages/Inbox'
import { parseInboxFilter } from '@/components/Console/Messages/inboxHref'
import { routing } from '@/i18n/routing'
import { requireSession } from '@/lib/auth/session'
import { getInbox, getInboxCounts } from '@/lib/contact'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Console.messages')
  return { title: t('title') }
}

// The inbox with nothing open. See docs/console.md#messages
export default async function MessagesPage({ params, searchParams }: PageProps<'/[locale]/console/contact-msgs'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  await requireSession(locale)

  const filter = parseInboxFilter((await searchParams).filter)
  const [t, messages, counts] = await Promise.all([getTranslations('Console.messages'), getInbox(filter), getInboxCounts()])

  return (
    <Inbox filter={filter} messages={messages} counts={counts}>
      <div className="grid min-h-80 place-items-center content-center justify-items-center gap-space-3 py-space-8 text-center text-body text-ink-muted">
        <MailOpen aria-hidden size={28} strokeWidth={1.75} />
        <p className="max-w-80">{t('pick')}</p>
      </div>
    </Inbox>
  )
}
