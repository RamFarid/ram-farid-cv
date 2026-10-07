import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import type { ProjectCaseStudy, ProjectScreenshot } from '@/lib/projects/types'
import { ScreenStage, type StageScreen } from './ScreenStage'

// The stage's caps, mirrored from the screen-stage utility in globals.css: height 600px, width min(78vw, 1040px).
const STAGE = { height: 600, width: 1040 }

function sizesFor(screen: ProjectScreenshot) {
  const ratio = screen.width / screen.height
  const desktop = Math.ceil(Math.min(STAGE.width, STAGE.height * ratio))
  // On phones a wide shot fills 78vw; a phone shot is held by the stage height (about 470px there).
  const phone = ratio >= 1 ? '78vw' : `${Math.ceil(470 * ratio)}px`
  return `(min-width: 1024px) ${desktop}px, ${phone}`
}

// The screens lead the case study, on a full-width surface band: a centred stage that shows one screen at a time
// with its neighbours peeking in, a caption, and a thumbnail strip. Every screen is in the server HTML in console
// order. Without screenshots the cover stands in; with neither, a monogram mat. See docs/portfolio.md#screens
export function ScreenGallery({ project }: { project: ProjectCaseStudy }) {
  const t = useTranslations('Project.screens')

  const source: ProjectScreenshot[] =
    project.screenshots.length > 0
      ? project.screenshots
      : project.cover
        ? [{ ...project.cover, device: 'desktop' }]
        : []

  const screens: StageScreen[] = source.map((screen, index) => ({
    url: screen.url,
    width: screen.width,
    height: screen.height,
    alt: screen.alt,
    caption: screen.caption ?? screen.alt,
    // Isolated so the numbers keep their order inside an Arabic caption.
    meta: `${t(screen.device)} · ⁦${index + 1} / ${source.length}⁩`,
    label: t('view', { n: index + 1, total: source.length, alt: screen.alt }),
    sizes: sizesFor(screen),
  }))

  const heading = (
    <h2 id="screens-title" className="text-h3 text-ink">
      {t('title')}
      {screens.length > 0 && (
        <span className="ms-space-3 font-mono text-code text-ink-muted tabular-nums">
          {t('count', { count: screens.length })}
        </span>
      )}
    </h2>
  )

  return (
    <section
      aria-labelledby="screens-title"
      className="overflow-clip border-y border-line bg-surface py-space-7 md:py-space-8"
    >
      {screens.length > 0 ? (
        <ScreenStage heading={heading} screens={screens} />
      ) : (
        <Container className="grid gap-space-5">
          {heading}
          <div className="grid aspect-[21/9] place-items-center rounded-lg border border-line bg-surface-raised">
            <span aria-hidden className="font-mono text-display text-line-strong">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </Container>
      )}
    </section>
  )
}
