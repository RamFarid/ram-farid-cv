'use client'

import { useTranslations } from 'next-intl'
import { ImageUpload } from '@/components/Console/ImageUpload'
import { AddButton, EmptyList, ListRow, newId } from '@/components/Console/ListParts'
import { SectionPanel } from '@/components/Console/SectionPanel'
import { SortableList } from '@/components/Console/SortableList'
import { LocalizedField } from '@/components/ui/LocalizedField'
import { TagInput } from '@/components/ui/TagInput'
import { TextField } from '@/components/ui/TextField'
import { useSectionDraft } from '@/hooks/useSectionDraft'
import { saveCertifications } from '@/lib/home/actions'
import { certificationsZSchema, homeLimits, type CertificationsInput } from '@/lib/validations/home'
import { useFieldErrors } from '@/components/Console/fieldErrors'

type Certification = CertificationsInput['certifications'][number]

export function CertificationsSection({ initial }: { initial: CertificationsInput }) {
  const t = useTranslations('Console.certifications')
  const { draft, update, errors, dirty, pending, save, discard } = useSectionDraft(
    'certifications',
    initial,
    certificationsZSchema,
    saveCertifications,
  )
  const fieldError = useFieldErrors(errors)
  const certs = draft.certifications

  const setCerts = (change: (certs: Certification[]) => Certification[]) =>
    update((current) => ({ ...current, certifications: change(current.certifications) }))
  const setCert = (id: string, patch: Partial<Certification>) =>
    setCerts((list) => list.map((cert) => (cert.id === id ? { ...cert, ...patch } : cert)))
  const label = (cert: Certification, index: number) => cert.name || t('untitled', { number: index + 1 })

  return (
    <SectionPanel
      id="certifications"
      index="05"
      title={t('title')}
      description={t('description')}
      dirty={dirty}
      pending={pending}
      onSave={() => save()}
      onDiscard={discard}
    >
      {certs.length === 0 ? (
        <EmptyList>{t('empty')}</EmptyList>
      ) : (
        <SortableList
          items={certs}
          getId={(cert) => cert.id}
          getLabel={label}
          onReorder={(next) => setCerts(() => next)}
          className="border-t border-line"
          renderItem={(cert, index, handle) => {
            const path = `certifications.${index}`
            return (
              <ListRow
                handle={handle}
                index={index}
                removeLabel={t('remove', { name: label(cert, index) })}
                onRemove={() => setCerts((list) => list.filter((item) => item.id !== cert.id))}
              >
                <div className="grid gap-space-5 md:grid-cols-[13rem_minmax(0,1fr)]">
                  <ImageUpload
                    label={t('image')}
                    folder="home/certificates"
                    aspect="landscape"
                    fit="contain"
                    value={cert.image}
                    onChange={(image) => setCert(cert.id, { image })}
                    error={fieldError.one(`${path}.image`)}
                    className="max-w-72 md:max-w-none"
                  />

                  <div className="grid content-start gap-space-5">
                    <div className="grid gap-space-4 sm:grid-cols-2">
                      <TextField
                        label={t('name')}
                        name={`cert-${cert.id}-name`}
                        hint={t('nameHint')}
                        value={cert.name}
                        maxLength={homeLimits.certName}
                        onChange={(event) => setCert(cert.id, { name: event.target.value })}
                        error={fieldError.one(`${path}.name`)}
                        dir="auto"
                      />
                      <TextField
                        label={t('issuer')}
                        name={`cert-${cert.id}-issuer`}
                        value={cert.issuer}
                        maxLength={homeLimits.certIssuer}
                        onChange={(event) => setCert(cert.id, { issuer: event.target.value })}
                        error={fieldError.one(`${path}.issuer`)}
                        dir="auto"
                      />
                      <TextField
                        label={t('issuedOn')}
                        name={`cert-${cert.id}-issued`}
                        type="month"
                        hint={t('issuedOnHint')}
                        value={cert.issuedOn}
                        onChange={(event) => setCert(cert.id, { issuedOn: event.target.value })}
                        error={fieldError.one(`${path}.issuedOn`)}
                        dir="ltr"
                      />
                      <TagInput
                        id={`cert-${cert.id}-skills`}
                        label={t('skills')}
                        value={cert.skills}
                        max={homeLimits.certSkills}
                        maxLength={homeLimits.tag}
                        placeholder={t('skillsPlaceholder')}
                        onChange={(skills) => setCert(cert.id, { skills })}
                        error={fieldError.one(`${path}.skills`)}
                      />
                    </div>
                    <LocalizedField
                      id={`cert-${cert.id}-description`}
                      label={t('descriptionField')}
                      multiline
                      rows={2}
                      value={cert.description}
                      maxLength={homeLimits.certDescription}
                      onChange={(description) => setCert(cert.id, { description })}
                      errors={fieldError.localized(`${path}.description`)}
                    />
                  </div>
                </div>
              </ListRow>
            )
          }}
        />
      )}

      <AddButton
        label={t('add')}
        full={certs.length >= homeLimits.certifications}
        fullNote={t('full', { max: homeLimits.certifications })}
        onClick={() =>
          setCerts((list) => [
            ...list,
            { id: newId(), name: '', issuer: '', issuedOn: '', description: { en: '', ar: '' }, skills: [], image: null },
          ])
        }
      />
    </SectionPanel>
  )
}
