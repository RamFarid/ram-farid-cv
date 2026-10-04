'use client'

import { useEffect, type ReactNode } from 'react'
import { Provider, useAtomValue } from 'jotai'
import { Toaster } from 'sonner'
import { useLocale } from 'next-intl'
import { localeDirection } from '@/i18n/routing'
import { dirtySectionsAtom } from '@/lib/state/console'

// The console's client-side frame: one Jotai store for the session's shared state, the toaster, and the browser's
// "leave this page?" prompt while any section has unsaved edits.

function UnsavedChangesGuard() {
  const dirty = useAtomValue(dirtySectionsAtom)

  useEffect(() => {
    if (dirty.size === 0) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  return null
}

export function ConsoleClient({ children }: { children: ReactNode }) {
  const locale = useLocale()
  const dir = localeDirection[locale]

  return (
    <Provider>
      {children}
      <UnsavedChangesGuard />
      <Toaster
        dir={dir}
        position={dir === 'rtl' ? 'bottom-left' : 'bottom-right'}
        toastOptions={{
          unstyled: true,
          classNames: {
            toast:
              'flex w-(--width) items-center gap-space-3 rounded-lg border border-line bg-surface-raised px-space-4 py-space-3 text-label text-ink shadow-md',
            success: '[&_[data-icon]]:text-success',
            error: 'border-danger [&_[data-icon]]:text-danger',
          },
        }}
      />
    </Provider>
  )
}
