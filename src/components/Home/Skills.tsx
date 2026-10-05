import { useTranslations } from 'next-intl'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import type { HomeSkillGroup } from '@/lib/home/types'
import { cn } from '@/utils'

// Tech names are data, so they stay mono and in Latin script; practices (database design, authorization) are
// translated words, so they're set in the sans. The two looks tell products from practices at a glance.
export function Skills({ skillGroups, className }: { skillGroups: HomeSkillGroup[]; className?: string }) {
  const t = useTranslations('Home.skills')
  if (skillGroups.length === 0) return null

  return (
    <section id="skills" aria-labelledby="skills-title" className={cn('grid content-start gap-space-7', className)}>
      <SectionHeading id="skills-title" index="05" eyebrow={t('eyebrow')} title={t('title')} />

      <div className="grid gap-x-space-6 gap-y-space-7 border-t border-line pt-space-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <div key={group.id} className="grid content-start gap-space-3">
            <h3 className="text-label text-ink">{group.name}</h3>
            <ul className="flex flex-wrap gap-space-2">
              {group.items.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
              {group.practices.map((practice) => (
                <li key={practice}>
                  <Tag className="font-sans">{practice}</Tag>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
