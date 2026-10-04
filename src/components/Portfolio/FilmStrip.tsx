'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { buttonClasses } from '@/components/ui/Button'
import { cn } from '@/utils'
import { PortfolioHead } from './PortfolioIntro'

type FilmStripProps = {
  count: number
  /** The page head's start side (h1 and lead), rendered on the server. */
  intro: ReactNode
  /** The project count, set above the counter on the head's end side. */
  summary: ReactNode
  /** The frames: one `<li data-frame>` per project, rendered on the server. */
  children: ReactNode
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The index head and the sideways rail of project frames. Scrolling and snapping are native CSS (film-rail in
// globals.css); this island adds the counter and prev/next buttons, which sit on the head's end side so they're in the
// first view, and each frame's --frame-focus. See docs/portfolio.md#index
export function FilmStrip({ count, intro, summary, children }: FilmStripProps) {
  const t = useTranslations('Portfolio')
  const rail = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [atEnd, setAtEnd] = useState(count <= 1)

  // The active frame is the one whose start edge sits nearest the rail's start inset. At the end of the rail the last
  // frames can't snap to the start, so the last one counts as active.
  useEffect(() => {
    const element = rail.current
    if (!element) return
    let pending = 0

    const measure = () => {
      pending = 0
      const style = getComputedStyle(element)
      const rtl = style.direction === 'rtl'
      const box = element.getBoundingClientRect()
      const inset = parseFloat(style.scrollPaddingInlineStart) || 0
      const edge = rtl ? box.right - inset : box.left + inset
      const frames = element.querySelectorAll<HTMLElement>('[data-frame]')

      let nearest = 0
      let best = Infinity
      frames.forEach((frame, index) => {
        const rect = frame.getBoundingClientRect()
        const distance = Math.abs((rtl ? rect.right : rect.left) - edge)
        if (distance < best) {
          best = distance
          nearest = index
        }

        // How much of the frame is inside the rail, for the frame-focus dimming in globals.css.
        const visible = Math.min(rect.right, box.right) - Math.max(rect.left, box.left)
        const focus = Math.min(Math.max(visible / rect.width, 0), 1)
        frame.style.setProperty('--frame-focus', focus.toFixed(3))
      })

      const end = Math.abs(element.scrollLeft) + element.clientWidth >= element.scrollWidth - 2
      setAtEnd(end)
      setActive(end ? frames.length - 1 : nearest)
    }

    const schedule = () => {
      pending ||= requestAnimationFrame(measure)
    }

    schedule()
    element.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(pending)
      element.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  const go = (step: -1 | 1) => {
    const frames = rail.current?.querySelectorAll<HTMLElement>('[data-frame]')
    const target = frames?.[Math.min(Math.max(active + step, 0), frames.length - 1)]
    target?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', inline: 'start', block: 'nearest' })
  }

  const controlClasses = cn(buttonClasses({ variant: 'secondary' }), 'size-11 px-0')
  const iconClasses = 'rtl:-scale-x-100'
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <>
      <PortfolioHead>
        <div className="lg:col-span-8">{intro}</div>
        <div className="grid justify-items-start gap-space-3 lg:col-span-4 lg:justify-items-end">
          {summary}
          {count > 1 && (
            <div className="flex items-center gap-space-4">
              <p className="font-mono text-code text-ink tabular-nums">
                <span aria-hidden dir="ltr">
                  {pad(active + 1)} / {pad(count)}
                </span>
                <span className="sr-only">{t('position', { current: active + 1, total: count })}</span>
              </p>
              <div className="flex gap-space-2">
                <button
                  type="button"
                  aria-label={t('previous')}
                  disabled={active === 0}
                  onClick={() => go(-1)}
                  className={controlClasses}
                >
                  <ArrowLeft aria-hidden size={18} strokeWidth={1.75} className={iconClasses} />
                </button>
                <button
                  type="button"
                  aria-label={t('next')}
                  disabled={atEnd}
                  onClick={() => go(1)}
                  className={controlClasses}
                >
                  <ArrowRight aria-hidden size={18} strokeWidth={1.75} className={iconClasses} />
                </button>
              </div>
            </div>
          )}
        </div>
      </PortfolioHead>

      <div className="field-violet overflow-clip py-space-6 md:py-space-7">
        <div ref={rail} role="region" aria-label={t('rail')} className="film-rail">
          <ol className="flex w-max gap-space-4 px-(--rail-inset) md:gap-space-6">{children}</ol>
        </div>
      </div>
    </>
  )
}
