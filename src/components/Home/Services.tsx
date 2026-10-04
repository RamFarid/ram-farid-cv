import { useTranslations } from 'next-intl'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { HomeService } from '@/lib/home/types'
import { cn } from '@/utils'

// Plain outcomes a client can hire for, in console order. See docs/console.md#services
export function Services({ services, className }: { services: HomeService[]; className?: string }) {
  const t = useTranslations('Home.services')
  if (services.length === 0) return null

  return (
    <section id="services" aria-labelledby="services-title" className={cn('grid content-start gap-space-7', className)}>
      <SectionHeading id="services-title" index="03" eyebrow={t('eyebrow')} title={t('title')} />

      <ul className="divide-y divide-line border-y border-line">
        {services.map((service) => (
          <li
            key={service.id}
            className="grid gap-space-2 py-space-5 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-space-6 lg:grid-cols-[minmax(0,22rem)_1fr]"
          >
            <h3 className="text-h3 text-ink">{service.title}</h3>
            <p className="max-w-measure text-body text-ink-muted">{service.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
