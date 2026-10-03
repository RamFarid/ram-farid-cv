import { useTranslations } from 'next-intl'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/utils'

// Plain outcomes a client can hire for. Drafted copy; Ram to confirm (docs/home.md#waiting-on-ram).
const services = ['apps', 'rebuilds', 'localization', 'servers'] as const

export function Services({ className }: { className?: string }) {
  const t = useTranslations('Home.services')

  return (
    <section id="services" aria-labelledby="services-title" className={cn('grid content-start gap-space-7', className)}>
      <SectionHeading id="services-title" index="03" eyebrow={t('eyebrow')} title={t('title')} />

      <ul className="divide-y divide-line border-y border-line">
        {services.map((service) => (
          <li key={service} className="grid gap-space-2 py-space-5 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-space-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
            <h3 className="text-h3 text-ink">{t(`items.${service}.title`)}</h3>
            <p className="max-w-measure text-body text-ink-muted">{t(`items.${service}.body`)}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
