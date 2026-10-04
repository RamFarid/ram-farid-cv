'use client'

import { useLocale, useTranslations } from 'next-intl'
import { AddButton, EmptyList, ListRow, newId } from '@/components/Console/ListParts'
import { SectionPanel } from '@/components/Console/SectionPanel'
import { SortableList } from '@/components/Console/SortableList'
import { LocalizedField } from '@/components/ui/LocalizedField'
import { useSectionDraft } from '@/hooks/useSectionDraft'
import { saveServices } from '@/lib/home/actions'
import { homeLimits, servicesZSchema, type ServicesInput } from '@/lib/validations/home'
import { useFieldErrors } from './fieldErrors'

type Service = ServicesInput['services'][number]

export function ServicesSection({ initial }: { initial: ServicesInput }) {
  const t = useTranslations('Console.services')
  const locale = useLocale()
  const { draft, update, errors, dirty, pending, save, discard } = useSectionDraft(
    'services',
    initial,
    servicesZSchema,
    saveServices,
  )
  const fieldError = useFieldErrors(errors)
  const services = draft.services

  const setServices = (change: (services: Service[]) => Service[]) =>
    update((current) => ({ ...current, services: change(current.services) }))
  const setService = (id: string, patch: Partial<Service>) =>
    setServices((list) => list.map((service) => (service.id === id ? { ...service, ...patch } : service)))
  const label = (service: Service, index: number) => service.title[locale] || t('untitled', { number: index + 1 })

  return (
    <SectionPanel
      id="services"
      index="03"
      title={t('title')}
      description={t('description')}
      dirty={dirty}
      pending={pending}
      onSave={save}
      onDiscard={discard}
    >
      {services.length === 0 ? (
        <EmptyList>{t('empty')}</EmptyList>
      ) : (
        <SortableList
          items={services}
          getId={(service) => service.id}
          getLabel={label}
          onReorder={(next) => setServices(() => next)}
          className="border-t border-line"
          renderItem={(service, index, handle) => (
            <ListRow
              handle={handle}
              index={index}
              removeLabel={t('remove', { name: label(service, index) })}
              onRemove={() => setServices((list) => list.filter((item) => item.id !== service.id))}
            >
              <div className="grid gap-space-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <LocalizedField
                  id={`service-${service.id}-title`}
                  label={t('name')}
                  value={service.title}
                  maxLength={homeLimits.serviceTitle}
                  onChange={(title) => setService(service.id, { title })}
                  errors={fieldError.localized(`services.${index}.title`)}
                />
                <LocalizedField
                  id={`service-${service.id}-body`}
                  label={t('body')}
                  multiline
                  rows={3}
                  value={service.body}
                  maxLength={homeLimits.serviceBody}
                  onChange={(body) => setService(service.id, { body })}
                  errors={fieldError.localized(`services.${index}.body`)}
                />
              </div>
            </ListRow>
          )}
        />
      )}

      <AddButton
        label={t('add')}
        full={services.length >= homeLimits.services}
        fullNote={t('full', { max: homeLimits.services })}
        onClick={() =>
          setServices((list) => [...list, { id: newId(), title: { en: '', ar: '' }, body: { en: '', ar: '' } }])
        }
      />
    </SectionPanel>
  )
}
