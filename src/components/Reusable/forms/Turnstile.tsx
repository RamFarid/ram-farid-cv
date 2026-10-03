'use client'

import { useEffect, useEffectEvent, useRef, useState } from 'react'
import Script from 'next/script'

// Cloudflare Turnstile, rendered explicitly so React owns the widget's lifetime. No wrapper library: the API is three calls.
// https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/ · See docs/contact.md#turnstile

type TurnstileOptions = {
  sitekey: string
  action?: string
  language?: string
  theme?: 'auto' | 'light' | 'dark'
  size?: 'normal' | 'flexible' | 'compact'
  appearance?: 'always' | 'execute' | 'interaction-only'
  'response-field'?: boolean
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: (code: string) => void
  'before-interactive-callback'?: () => void
  'after-interactive-callback'?: () => void
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileOptions) => string | undefined
      remove: (widgetId: string) => void
    }
  }
}

type TurnstileProps = {
  siteKey: string
  /** Shown in Cloudflare's analytics, e.g. "contact". */
  action: string
  language: string
  /** The current token, or null while there is none (not yet solved, expired or failed). */
  onToken: (token: string | null) => void
  /** Whether Cloudflare is showing the widget, i.e. asking the visitor to click. Hidden otherwise. */
  onVisibleChange?: (visible: boolean) => void
  /** Change it to get a fresh widget: each token is single use. */
  resetKey?: number
  className?: string
}

export function Turnstile({ siteKey, action, language, onToken, onVisibleChange, resetKey, className }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const emit = useEffectEvent(onToken)
  const show = useEffectEvent((visible: boolean) => onVisibleChange?.(visible))

  useEffect(() => {
    if (!loaded || !container.current || !window.turnstile) return
    const widgetId = window.turnstile.render(container.current, {
      sitekey: siteKey,
      action,
      language,
      theme: 'dark',
      size: 'flexible',
      // Invisible unless Cloudflare needs the visitor to click.
      appearance: 'interaction-only',
      // The form sends the token itself, from state.
      'response-field': false,
      callback: (token) => emit(token),
      'expired-callback': () => emit(null),
      'error-callback': () => emit(null),
      'before-interactive-callback': () => show(true),
      'after-interactive-callback': () => show(false),
    })

    return () => {
      emit(null)
      show(false)
      if (widgetId) window.turnstile?.remove(widgetId)
    }
  }, [loaded, siteKey, action, language, resetKey])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setLoaded(true)}
      />
      <div ref={container} className={className} />
    </>
  )
}
