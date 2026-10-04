import type { ReactNode } from 'react'
import { Phone } from 'lucide-react'
import { getFormatter, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { CONSOLE_TIME_ZONE } from '@/lib/console'
import type { InboxMessage } from '@/lib/contact/types'
import type { InboxFilter } from '@/lib/db/contact'
import { cn } from '@/utils'
import { inboxFilters, inboxHref } from './inboxHref'

// The console's inbox frame: the filter row, then the message list beside the open message (from lg). Under lg the
// list page shows only the list and a message page only the message. See docs/console.md#messages

type InboxProps = {
  filter: InboxFilter
  messages: InboxMessage[]
  counts: Record<InboxFilter, number>
  selectedId?: string
  /** The open message, or the prompt to pick one. */
  children: ReactNode
}

export async function Inbox({ filter, messages, counts, selectedId, children }: InboxProps) {
  const t = await getTranslations('Console.messages')
  const format = await getFormatter()
  const now = new Date()

  return (
    <div className="mx-auto max-w-page">
      <header className={cn('grid gap-space-4 pt-space-7 pb-space-5', selectedId && 'max-lg:hidden')}>
        <h1 className="text-h2 text-ink">{t('title')}</h1>
        <nav aria-label={t('filtersLabel')}>
          <ul className="flex flex-wrap gap-space-1">
            {inboxFilters.map((item) => (
              <li key={item}>
                <Link
                  href={inboxHref(item)}
                  aria-current={item === filter ? 'page' : undefined}
                  className="inline-flex h-9 items-center gap-space-2 rounded-md border border-line px-space-3 text-label text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink aria-[current=page]:border-line-strong aria-[current=page]:bg-surface-raised aria-[current=page]:text-ink"
                >
                  {t(`filters.${item}`)}
                  <span className="font-mono text-code tabular-nums">{format.number(counts[item])}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="grid border-t border-line lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
        <div className={cn('lg:border-e lg:border-line', selectedId && 'max-lg:hidden')}>
          {messages.length === 0 ? (
            <p className="max-w-measure py-space-7 text-body text-ink-muted lg:pe-space-5">{t(`empty.${filter}`)}</p>
          ) : (
            <ul className="divide-y divide-line">
              {messages.map((message) => {
                const isNew = message.status === 'new'
                const received = new Date(message.receivedAt)
                return (
                  <li key={message.id}>
                    <Link
                      href={inboxHref(filter, message.id)}
                      aria-current={message.id === selectedId ? 'page' : undefined}
                      className="grid gap-space-1 px-space-3 py-space-4 transition-colors hover:bg-surface aria-[current=page]:bg-surface-raised lg:-ms-space-3"
                    >
                      <span className="flex items-center gap-space-2">
                        {isNew && (
                          <span className="size-2 shrink-0 rounded-full bg-warning">
                            <span className="sr-only">{t('new')}</span>
                          </span>
                        )}
                        <span className={cn('min-w-0 flex-1 truncate text-label', isNew ? 'text-ink' : 'text-ink-muted')}>
                          {message.name}
                        </span>
                        <time
                          dateTime={message.receivedAt}
                          title={format.dateTime(received, { dateStyle: 'full', timeStyle: 'short', timeZone: CONSOLE_TIME_ZONE })}
                          className="shrink-0 font-mono text-code text-ink-muted"
                        >
                          {format.relativeTime(received, now)}
                        </time>
                      </span>
                      <span dir="auto" lang={message.locale} className="line-clamp-2 text-small text-ink-muted">
                        {message.message}
                      </span>
                      <span className="flex items-center gap-space-2 font-mono text-code text-ink-muted">
                        <span>{message.locale.toUpperCase()}</span>
                        {message.phone && (
                          <>
                            <Phone aria-hidden size={14} strokeWidth={1.75} />
                            <span className="sr-only">{t('hasPhone')}</span>
                          </>
                        )}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className={cn('min-w-0 lg:ps-space-7', !selectedId && 'max-lg:hidden')}>{children}</div>
      </div>
    </div>
  )
}
