import type { CSSProperties } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { PhotoViewer } from '@/components/Reusable/media/PhotoViewer'
import { Container } from '@/components/ui/Container'
import { localeDirection } from '@/i18n/routing'
import type { ProjectCaseStudy, ProjectScreenshot } from '@/lib/projects/types'
import { cn } from '@/utils'
import { ScreenThumb } from './ScreenThumb'

// Base row height from sm and lg (the ul's --row-height); `sizes` below is derived from the same numbers.
const ROW_HEIGHT = { sm: 220, lg: 300 }

function sizesFor(screen: ProjectScreenshot) {
  const ratio = screen.width / screen.height
  // Rows grow up to 1.5x their base height (the li's max-width); phones take half the width under sm.
  const width = (rowHeight: number) => Math.ceil(ratio * rowHeight * 1.5)
  const phone = screen.device === 'mobile' ? '50vw' : '100vw'
  return `(min-width: 1024px) ${width(ROW_HEIGHT.lg)}px, (min-width: 640px) ${width(ROW_HEIGHT.sm)}px, ${phone}`
}

// The screens lead the case study. From sm, desktop and phone shots share justified rows at one height: each item grows
// in proportion to its aspect ratio, so rows line up flush with no JavaScript; growth is capped at 1.5x so a row that
// wraps early doesn't balloon, and the trailing filler keeps a short last row from stretching. Under sm, desktop shots
// take the full width and phones pair up in source order (no dense packing, so what you see, the Tab order and the
// viewer's arrow keys all agree; a phone without a pair keeps its single cell). Without screenshots the cover stands in. See docs/portfolio.md#case-study
export function ScreenGallery({ project }: { project: ProjectCaseStudy }) {
  const t = useTranslations('Project.screens')
  const locale = useLocale()

  const screens: ProjectScreenshot[] =
    project.screenshots.length > 0
      ? project.screenshots
      : project.cover
        ? [{ ...project.cover, device: 'desktop' }]
        : []

  return (
    <section aria-labelledby="screens-title" className="pb-space-8 md:pb-space-9">
      <Container className="grid gap-space-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-space-5 gap-y-space-1 border-t border-line pt-space-5">
          <h2 id="screens-title" className="text-h3 text-ink">
            {t('title')}
            {screens.length > 0 && (
              <span className="ms-space-3 font-mono text-code text-ink-muted tabular-nums">
                {t('count', { count: screens.length })}
              </span>
            )}
          </h2>
          {screens.length > 0 && <p className="text-small text-ink-muted">{t('hint')}</p>}
        </div>

        {screens.length > 0 ? (
          <PhotoViewer>
            <ul
              className="grid grid-cols-2 gap-space-3 sm:flex sm:flex-wrap sm:[--row-height:220px] sm:after:grow-[1000] sm:after:content-[''] lg:[--row-height:300px]"
            >
              {screens.map((screen, index) => {
                const ratio = screen.width / screen.height
                // Isolated so the numbers keep their order inside an Arabic caption.
                const meta = `${t(screen.device)} · \u2066${index + 1} / ${screens.length}\u2069`

                return (
                  <li
                    key={screen.url}
                    style={{ '--ratio': ratio } as CSSProperties}
                    className={cn(
                      'min-w-0 sm:max-w-[calc(var(--ratio)*var(--row-height)*1.5)] sm:grow-(--ratio) sm:basis-[calc(var(--ratio)*var(--row-height))]',
                      screen.device === 'desktop' && 'col-span-2',
                    )}
                  >
                    <ScreenThumb
                      image={screen}
                      label={t('view', { n: index + 1, total: screens.length, alt: screen.alt })}
                      caption={screen.caption ?? screen.alt}
                      meta={meta}
                      sizes={sizesFor(screen)}
                      dir={localeDirection[locale]}
                      eager={index < 2}
                    />
                  </li>
                )
              })}
            </ul>
          </PhotoViewer>
        ) : (
          <div className="grid aspect-[21/9] place-items-center rounded-lg border border-line bg-surface-raised">
            <span aria-hidden className="font-mono text-display text-line-strong">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}
      </Container>
    </section>
  )
}
