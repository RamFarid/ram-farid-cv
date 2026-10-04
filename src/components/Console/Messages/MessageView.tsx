import { ArrowLeft, Mail } from 'lucide-react'
import { getFormatter, getTranslations } from 'next-intl/server'
import { ButtonLink } from '@/components/ui/Button'
import { Link } from '@/i18n/navigation'
import { CONSOLE_TIME_ZONE } from '@/lib/console'
import { whatsappUrl } from '@/lib/contact'
import type { InboxMessage } from '@/lib/contact/types'
import type { InboxFilter } from '@/lib/db/contact'
import { inboxHref } from './inboxHref'
import { MarkAsRead, MessageActions } from './MessageActions'

// One message: who wrote and how to reach them, the message in its own language and direction, then the replies
// and filing actions. Reply by email is the view's one primary action.
export async function MessageView({ message, filter }: { message: InboxMessage; filter: InboxFilter }) {
  const t = await getTranslations('Console.messages')
  // The reply's subject is written in the visitor's language, not the console's.
  const tReply = await getTranslations({ locale: message.locale, namespace: 'Console.messages' })
  const format = await getFormatter()
  const received = format.dateTime(new Date(message.receivedAt), {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: CONSOLE_TIME_ZONE,
  })
  const mailto = `mailto:${message.email}?subject=${encodeURIComponent(tReply('replySubject'))}`

  return (
    <article aria-labelledby="message-title" className="grid content-start gap-space-6 py-space-6 lg:py-space-7">
      <Link
        href={inboxHref(filter)}
        className="inline-flex w-fit items-center gap-space-2 rounded-md text-label text-ink-muted transition-colors hover:text-ink lg:hidden"
      >
        <ArrowLeft aria-hidden size={18} strokeWidth={1.75} className="rtl:-scale-x-100" />
        {t('back')}
      </Link>

      <header className="grid gap-space-2">
        <div className="flex flex-wrap items-center gap-space-3">
          <h2 id="message-title" className="text-h2 text-ink">
            {message.name}
          </h2>
          {message.status === 'archived' && (
            <span className="rounded-sm border border-line px-1.5 py-0.5 text-small text-ink-muted">{t('archivedBadge')}</span>
          )}
        </div>
        <p className="font-mono text-code text-ink-muted">
          <time dateTime={message.receivedAt}>{received}</time>
          {' · '}
          {t(`languages.${message.locale}`)}
        </p>
      </header>

      <dl className="grid max-w-measure grid-cols-[auto_minmax(0,1fr)] gap-x-space-5 gap-y-space-2 border-y border-line py-space-4">
        <dt className="text-label text-ink-muted">{t('email')}</dt>
        <dd className="min-w-0">
          <a href={`mailto:${message.email}`} dir="ltr" className="break-all font-mono text-code text-link underline-offset-4 hover:underline">
            {message.email}
          </a>
        </dd>
        {message.phone && (
          <>
            <dt className="text-label text-ink-muted">{t('phone')}</dt>
            <dd>
              <a href={`tel:${message.phone.replace(/[^\d+]/g, '')}`} dir="ltr" className="font-mono text-code text-link underline-offset-4 hover:underline">
                {message.phone}
              </a>
            </dd>
          </>
        )}
      </dl>

      <p dir="auto" lang={message.locale} className="max-w-measure text-body-lg break-words whitespace-pre-wrap text-ink">
        {message.message}
      </p>

      <div className="flex flex-wrap items-center gap-space-2 border-t border-line pt-space-5">
        <ButtonLink href={mailto} icon={<Mail aria-hidden size={18} strokeWidth={1.75} />}>
          {t('reply')}
        </ButtonLink>
        {message.phone && (
          <ButtonLink href={whatsappUrl(message.phone)} external variant="secondary">
            {t('whatsapp')}
          </ButtonLink>
        )}
        <MessageActions id={message.id} status={message.status} filter={filter} />
      </div>

      {message.status === 'new' && <MarkAsRead id={message.id} />}
    </article>
  )
}
