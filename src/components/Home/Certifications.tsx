import { useFormatter, useLocale, useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Tag } from '@/components/ui/Tag'
import { localeDirection } from '@/i18n/routing'
import { certifications } from '@/lib/profile'
import { CertificateThumb, CertificateViewer } from './CertificateViewer'

// The certificates themselves, not a list of names: each one opens full size. Text stays server-rendered for search.
export function Certifications() {
  const t = useTranslations('Home.certifications')
  const locale = useLocale()
  const format = useFormatter()
  if (certifications.length === 0) return null

  return (
    <section id="certifications" aria-labelledby="certifications-title" className="py-space-8 md:py-space-9">
      <Container className="grid gap-space-7">
        <SectionHeading id="certifications-title" index="05" eyebrow={t('eyebrow')} title={t('title')} />

        <CertificateViewer>
          <ul className="grid gap-x-space-5 gap-y-space-7 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert) => {
              const date = cert.issuedOn
                ? format.dateTime(new Date(`${cert.issuedOn}-01T00:00:00Z`), {
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })
                : undefined
              const meta = date ? `${cert.issuer} · ${date}` : cert.issuer

              return (
                <li key={cert.slug} className="grid content-start gap-space-4">
                  {cert.image ? (
                    <CertificateThumb
                      image={cert.image}
                      label={t('view', { name: cert.name })}
                      name={cert.name}
                      meta={meta}
                      dir={localeDirection[locale]}
                    />
                  ) : (
                    // TODO(Ram): the certificate image. Until it exists, a mat with the issuer's initials.
                    <div aria-hidden className="rounded-lg border border-line bg-surface-raised p-space-3">
                      <div className="grid aspect-[4/3] place-items-center">
                        <span className="font-mono text-numeral text-line-strong">
                          {cert.issuer.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-space-2">
                    <h3 className="text-h3 text-balance text-ink">{cert.name}</h3>
                    <p className="font-mono text-code text-ink-muted">{meta}</p>
                    <p className="text-body text-ink-muted">{cert.description[locale]}</p>
                  </div>

                  {cert.skills.length > 0 && (
                    <ul className="flex flex-wrap gap-space-2">
                      {cert.skills.slice(0, 4).map((skill) => (
                        <li key={skill}>
                          <Tag>{skill}</Tag>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </CertificateViewer>
      </Container>
    </section>
  )
}
