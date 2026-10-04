import type { InboxFilter } from '@/lib/db/contact'

// Filters and selection live in the URL, so Telegram links, reloads and the back button land on the same view.

export const inboxFilters: InboxFilter[] = ['inbox', 'unread', 'archived']

export function parseInboxFilter(value: string | string[] | undefined): InboxFilter {
  return inboxFilters.includes(value as InboxFilter) ? (value as InboxFilter) : 'inbox'
}

/** A list or message URL that keeps the current filter (the default one stays out of the URL). */
export function inboxHref(filter: InboxFilter, id?: string) {
  const pathname = id ? `/console/contact-msgs/${id}` : '/console/contact-msgs'
  return filter === 'inbox' ? pathname : { pathname, query: { filter } }
}
