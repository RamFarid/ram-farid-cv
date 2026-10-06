import { useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { FaqItem } from '@/lib/home/faq'

// Questions clients and recruiters ask, answered in full. Native <details>: every answer is in the server HTML, so
// search and answer engines read it whether or not it's open, and it needs no JavaScript. See docs/home.md#faq
export function Faq({ items }: { items: FaqItem[] }) {
  const t = useTranslations('Home.faq')

  return (
    <section id="faq" aria-labelledby="faq-title" className="border-y border-line bg-surface py-space-8 md:py-space-9">
      <Container className="grid gap-space-7 lg:grid-cols-12 lg:gap-space-6">
        <SectionHeading
          id="faq-title"
          index="07"
          eyebrow={t('eyebrow')}
          title={t('title')}
          className="lg:sticky lg:top-[calc(var(--nav-height)+var(--space-7))] lg:col-span-4 lg:self-start"
        />

        <div className="divide-y divide-line border-y border-line lg:col-span-8">
          {items.map((item) => (
            <details key={item.id} id={`faq-${item.id}`} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-space-4 py-space-5 text-ink transition-colors hover:text-primary-ink [&::-webkit-details-marker]:hidden">
                <h3 className="text-h3">{item.question}</h3>
                <ChevronDown
                  aria-hidden
                  size={22}
                  strokeWidth={1.75}
                  className="mt-1 shrink-0 text-ink-muted transition-transform duration-(--duration-base) ease-out group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="max-w-measure pb-space-6 text-body text-ink-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
