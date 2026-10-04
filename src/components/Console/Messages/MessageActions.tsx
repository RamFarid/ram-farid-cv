'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { useRouter } from '@/i18n/navigation'
import { deleteMessage, setMessageStatus } from '@/lib/contact/actions'
import type { InboxActionResult, InboxStatus } from '@/lib/contact/types'
import type { InboxFilter } from '@/lib/db/contact'
import { inboxHref } from './inboxHref'

/**
 * Marks a new message read once it has been shown. It runs from the client after render, so opening the page (or a
 * link preview fetching it) never changes data by itself.
 */
export function MarkAsRead({ id }: { id: string }) {
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    done.current = true
    void setMessageStatus(id, 'read')
  }, [id])
  return null
}

// Filing actions: read state, archive, and (only in the archive) a permanent delete behind a second click.
export function MessageActions({ id, status, filter }: { id: string; status: InboxStatus; filter: InboxFilter }) {
  const t = useTranslations('Console.messages')
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [confirming, setConfirming] = useState(false)

  const run = (action: () => Promise<InboxActionResult>, success: string, after?: () => void) =>
    startTransition(async () => {
      const result = await action().catch((): InboxActionResult => ({ ok: false, error: 'unavailable' }))
      if (result.ok) {
        toast.success(success)
        after?.()
      } else {
        toast.error(t(`errors.${result.error}`))
      }
    })

  return (
    <div className="flex flex-wrap items-center gap-space-1 sm:ms-auto">
      {status !== 'archived' && (
        <Button
          variant="quiet"
          size="sm"
          disabled={pending}
          onClick={() =>
            status === 'new'
              ? run(() => setMessageStatus(id, 'read'), t('toasts.read'))
              : run(() => setMessageStatus(id, 'new'), t('toasts.unread'))
          }
        >
          {status === 'new' ? t('markRead') : t('markUnread')}
        </Button>
      )}

      {status === 'archived' ? (
        <Button variant="quiet" size="sm" disabled={pending} onClick={() => run(() => setMessageStatus(id, 'read'), t('toasts.restored'))}>
          {t('unarchive')}
        </Button>
      ) : (
        <Button variant="quiet" size="sm" disabled={pending} onClick={() => run(() => setMessageStatus(id, 'archived'), t('toasts.archived'))}>
          {t('archive')}
        </Button>
      )}

      {status === 'archived' &&
        (confirming ? (
          <span role="group" aria-label={t('confirmDelete')} className="inline-flex items-center gap-space-1">
            <span className="px-space-2 text-small text-danger">{t('confirmDelete')}</span>
            <Button
              size="sm"
              variant="secondary"
              disabled={pending}
              className="border-danger text-danger hover:border-danger hover:bg-danger-soft"
              onClick={() => run(() => deleteMessage(id), t('toasts.deleted'), () => router.push(inboxHref(filter)))}
            >
              {t('delete')}
            </Button>
            <Button size="sm" variant="quiet" disabled={pending} onClick={() => setConfirming(false)}>
              {t('cancel')}
            </Button>
          </span>
        ) : (
          <Button size="sm" variant="quiet" disabled={pending} onClick={() => setConfirming(true)} className="hover:bg-danger-soft hover:text-danger">
            {t('delete')}
          </Button>
        ))}
    </div>
  )
}
