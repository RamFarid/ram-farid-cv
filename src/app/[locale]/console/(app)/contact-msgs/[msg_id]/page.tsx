import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inbox } from '@/components/Console/Messages/Inbox'
import { parseInboxFilter } from '@/components/Console/Messages/inboxHref'
import { MessageView } from '@/components/Console/Messages/MessageView'
import { routing } from '@/i18n/routing'
import { requireSession } from '@/lib/auth/session'
import { getInbox, getInboxCounts, getInboxMessage } from '@/lib/contact'

export async function generateMetadata({ params }: PageProps<'/[locale]/console/contact-msgs/[msg_id]'>): Promise<Metadata> {
  const t = await getTranslations('Console.messages')
  const message = await getInboxMessage((await params).msg_id)
  return { title: message ? t('titleFrom', { name: message.name }) : t('title') }
}

// One open message beside the list. The Telegram notification's "Show in console" button links here.
// See docs/console.md#messages
export default async function MessagePage({ params, searchParams }: PageProps<'/[locale]/console/contact-msgs/[msg_id]'>) {
  const { locale, msg_id } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  await requireSession(locale)

  const filter = parseInboxFilter((await searchParams).filter)
  const [message, messages, counts] = await Promise.all([getInboxMessage(msg_id), getInbox(filter), getInboxCounts()])
  if (!message) notFound()

  return (
    <Inbox filter={filter} messages={messages} counts={counts} selectedId={message.id}>
      <MessageView message={message} filter={filter} />
    </Inbox>
  )
}
