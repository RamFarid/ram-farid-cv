'use client'

import { createRef, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { PhotoSlider } from 'react-photo-view'
import { PhotoCaption, viewerOptions } from '@/components/Reusable/media/PhotoViewer'
import { buttonClasses } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { localeDirection } from '@/i18n/routing'
import { cn } from '@/utils'

export type StageScreen = {
  url: string
  width: number
  height: number
  alt: string
  /** The caption under the stage and in the viewer: the screen's caption, or its alt. */
  caption: string
  /** Device and position, e.g. "Phone · 3 / 12". */
  meta: string
  /** Accessible name of the slide, e.g. "View screen 3 of 12: <alt>". */
  label: string
  sizes: string
}

type ScreenStageProps = {
  /** The section's h2 and count, rendered on the server. */
  heading: ReactNode
  screens: StageScreen[]
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Exponential ease-out: the glide covers most of the distance at once and settles gently.
const easeOutExpo = (progress: number) => (progress >= 1 ? 1 : 1 - 2 ** (-10 * progress))

// The case study's screens on a full-width stage: one native scroll-snap rail whose active screen sits in the centre
// while its neighbours peek in, dimmed and set back (the film strip's --frame-focus, measured from the centre here).
// Swiping and trackpads scroll it natively; the arrows, the thumbnails and the arrow keys glide it with an eased tween.
// The centre screen opens the shared viewer, and the stage follows the viewer so closing zooms back into the screen
// you ended on. See docs/portfolio.md#screens
export function ScreenStage({ heading, screens }: ScreenStageProps) {
  const t = useTranslations('Project.screens')
  const dir = localeDirection[useLocale()]
  const rail = useRef<HTMLDivElement>(null)
  const strip = useRef<HTMLDivElement>(null)
  const marker = useRef<HTMLSpanElement>(null)
  const glide = useRef<number | null>(null)
  const [active, setActive] = useState(0)
  const [viewing, setViewing] = useState<number | null>(null)
  const [origins] = useState(() => screens.map(() => createRef<HTMLButtonElement>()))
  const count = screens.length

  const slides = () => rail.current?.querySelectorAll<HTMLElement>('[data-screen]') ?? []

  const stopGlide = () => {
    if (glide.current === null) return
    cancelAnimationFrame(glide.current)
    glide.current = null
    if (rail.current) rail.current.style.scrollSnapType = ''
  }

  // Centres a screen. Snapping is paused while the tween runs, or it would fight every frame.
  const go = (index: number, { instant = false } = {}) => {
    const element = rail.current
    const slide = slides()[index]
    if (!element || !slide) return
    stopGlide()
    setActive(index)

    const box = element.getBoundingClientRect()
    const rect = slide.getBoundingClientRect()
    const delta = rect.left + rect.width / 2 - (box.left + box.width / 2)
    const from = element.scrollLeft
    if (instant || reducedMotion() || Math.abs(delta) < 1) {
      element.scrollLeft = from + delta
      return
    }

    element.style.scrollSnapType = 'none'
    const duration = Math.min(720, 420 + Math.abs(delta) * 0.12)
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      element.scrollLeft = from + delta * easeOutExpo(progress)
      if (progress < 1) glide.current = requestAnimationFrame(tick)
      else {
        glide.current = null
        element.style.scrollSnapType = ''
      }
    }
    glide.current = requestAnimationFrame(tick)
  }

  // The active screen is the one nearest the stage's centre; each screen's focus falls off over its own width.
  useEffect(() => {
    const element = rail.current
    if (!element) return
    let pending = 0

    const measure = () => {
      pending = 0
      const box = element.getBoundingClientRect()
      const centre = box.left + box.width / 2
      let nearest = 0
      let best = Infinity
      element.querySelectorAll<HTMLElement>('[data-screen]').forEach((slide, index) => {
        const rect = slide.getBoundingClientRect()
        const distance = Math.abs(rect.left + rect.width / 2 - centre)
        if (distance < best) {
          best = distance
          nearest = index
        }
        slide.style.setProperty('--frame-focus', (1 - Math.min(distance / rect.width, 1)).toFixed(3))
      })
      // A glide already chose its target; the screens it passes on the way don't become active.
      if (glide.current === null) setActive(nearest)
    }

    const schedule = () => {
      pending ||= requestAnimationFrame(measure)
    }
    // Any hand on the stage takes over from a running glide.
    const takeOver = () => stopGlide()

    schedule()
    element.addEventListener('scroll', schedule, { passive: true })
    element.addEventListener('wheel', takeOver, { passive: true })
    element.addEventListener('touchstart', takeOver, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(pending)
      stopGlide()
      element.removeEventListener('scroll', schedule)
      element.removeEventListener('wheel', takeOver)
      element.removeEventListener('touchstart', takeOver)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  // The marker slides to the active thumbnail, and the strip scrolls to keep that thumbnail in the middle.
  // offsetLeft and translate are both physical, so this holds in RTL too.
  useEffect(() => {
    const scroller = strip.current
    const bar = marker.current
    const thumb = scroller?.querySelectorAll<HTMLElement>('[data-thumb]')[active]
    if (!scroller || !bar || !thumb) return

    const place = () => {
      bar.style.translate = `${thumb.offsetLeft}px 0`
      bar.style.width = `${thumb.offsetWidth}px`
    }
    place()
    if (!bar.dataset.ready) {
      // Lay out the first position before the transition exists, so the marker doesn't slide in from the edge.
      void bar.offsetWidth
      bar.dataset.ready = 'true'
    }

    const box = scroller.getBoundingClientRect()
    const rect = thumb.getBoundingClientRect()
    scroller.scrollBy({
      left: rect.left + rect.width / 2 - (box.left + box.width / 2),
      behavior: reducedMotion() ? 'auto' : 'smooth',
    })

    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active])

  const step = (by: -1 | 1) => go(Math.min(Math.max(active + by, 0), count - 1))

  // Roving focus: only the active screen is in the Tab order; the arrow keys move along the stage, in reading direction.
  const onKeyDown = (event: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: dir === 'rtl' ? active - 1 : active + 1,
      ArrowLeft: dir === 'rtl' ? active + 1 : active - 1,
      Home: 0,
      End: count - 1,
    }
    const target = keys[event.key]
    if (target === undefined || target < 0 || target >= count) return
    event.preventDefault()
    go(target)
    origins[target].current?.focus({ preventScroll: true })
  }

  const first = screens[0]
  const last = screens[count - 1]
  const controlClasses = cn(buttonClasses({ variant: 'secondary' }), 'size-11 px-0')
  const pad = (n: number) => String(n).padStart(2, '0')
  const current = screens[active]

  return (
    <div className="grid gap-space-5">
      <Container className="flex flex-wrap items-end justify-between gap-x-space-5 gap-y-space-3">
        {heading}
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
                onClick={() => step(-1)}
                className={controlClasses}
              >
                <ArrowLeft aria-hidden size={18} strokeWidth={1.75} className="rtl:-scale-x-100" />
              </button>
              <button
                type="button"
                aria-label={t('next')}
                disabled={active === count - 1}
                onClick={() => step(1)}
                className={controlClasses}
              >
                <ArrowRight aria-hidden size={18} strokeWidth={1.75} className="rtl:-scale-x-100" />
              </button>
            </div>
          </div>
        )}
      </Container>

      <div ref={rail} role="region" aria-label={t('stage')} className="screen-stage" onKeyDown={onKeyDown}>
        <ol
          style={
            {
              '--first-ratio': first.width / first.height,
              '--last-ratio': last.width / last.height,
            } as CSSProperties
          }
        >
          {screens.map((screen, index) => (
            <li key={screen.url} data-screen style={{ '--ratio': screen.width / screen.height } as CSSProperties}>
              <button
                ref={origins[index]}
                type="button"
                aria-label={screen.label}
                aria-current={index === active ? 'true' : undefined}
                tabIndex={index === active ? 0 : -1}
                onClick={() => (index === active ? setViewing(index) : go(index))}
                style={{ aspectRatio: `${screen.width} / ${screen.height}` }}
                className={cn(
                  'relative block w-full overflow-hidden rounded-md border border-line bg-surface-raised',
                  'transition-[border-color,box-shadow] duration-(--duration-base) ease-out',
                  index === active ? 'cursor-zoom-in hover:border-primary hover:shadow-glow' : 'cursor-pointer',
                )}
              >
                {/* The button's label names it for screen readers; the alt is for image search. */}
                <Image
                  src={screen.url}
                  alt={screen.alt}
                  fill
                  sizes={screen.sizes}
                  loading={index < 3 ? 'eager' : undefined}
                  fetchPriority={index === 0 ? 'high' : undefined}
                  draggable={false}
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ol>
      </div>

      <Container className="grid gap-space-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-space-5 gap-y-space-1">
          {/* Keyed, so each new screen's caption plays the swap-in. */}
          <p key={active} className="caption-swap grid gap-space-1">
            <span className="text-label text-ink">{current.caption}</span>
            <span className="font-mono text-code text-ink-muted">{current.meta}</span>
          </p>
          <p className="text-small text-ink-muted">{t('hint', { count })}</p>
        </div>

        {count > 1 && (
          // A pointer shortcut along the stage; keyboard and screen-reader users move on the stage itself.
          <div
            ref={strip}
            aria-hidden
            className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="relative w-max pb-space-2">
              <ol className="flex gap-space-2">
                {screens.map((screen, index) => (
                  <li key={screen.url} data-thumb>
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => go(index)}
                      style={{ aspectRatio: `${screen.width} / ${screen.height}` }}
                      className={cn(
                        'relative block h-14 overflow-hidden rounded-sm border border-line bg-surface-raised',
                        'transition-opacity duration-(--duration-base) ease-out',
                        index === active ? 'opacity-100' : 'opacity-45 hover:opacity-80',
                      )}
                    >
                      <Image src={screen.url} alt="" fill sizes="112px" className="object-cover" />
                    </button>
                  </li>
                ))}
              </ol>
              {/* Physical left: the effect above positions it with offsetLeft, which is physical in both directions. */}
              <span ref={marker} className="thumb-marker absolute bottom-0 left-0 h-0.5 rounded-xs bg-primary" />
            </div>
          </div>
        )}
      </Container>

      <PhotoSlider
        {...viewerOptions}
        images={screens.map((screen, index) => ({
          key: screen.url,
          src: screen.url,
          width: screen.width,
          height: screen.height,
          originRef: origins[index],
          overlay: <PhotoCaption title={screen.caption} meta={screen.meta} dir={dir} />,
        }))}
        visible={viewing !== null}
        index={viewing ?? active}
        onIndexChange={(index) => {
          setViewing(index)
          // Behind the mask, so it jumps; closing then zooms back into a centred screen.
          go(index, { instant: true })
        }}
        onClose={() => setViewing(null)}
      />
    </div>
  )
}
