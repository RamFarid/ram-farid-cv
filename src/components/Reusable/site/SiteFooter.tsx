import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Arrow } from '@/components/ui/Arrow'
import { Container } from '@/components/ui/Container'
import { socialLinks } from '@/lib/profile'

export function SiteFooter() {
  const t = useTranslations('Footer')

  return (
    <footer className="border-t border-line">
      <Container className="grid gap-space-7 py-space-8 md:grid-cols-12 md:items-end">
        <div className="grid gap-space-4 md:col-span-6">
          {/* The full lock-up, 48px or taller (logo rules); it reads "Ram" in both languages. */}
          <Image src="/brand/ram-logo-on-dark.svg" alt="Ram" width={56} height={57} />
          <p className="text-small text-ink-muted">{t('tagline')}</p>
        </div>

        <div className="grid gap-space-3 md:col-span-6 md:justify-items-end">
          <h2 className="text-small text-ink-muted">{t('social')}</h2>
          <ul className="flex flex-wrap gap-x-space-5 gap-y-space-2">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noreferrer"
                  className="group inline-flex items-center gap-space-1 text-label text-ink transition-colors hover:text-primary-ink"
                >
                  {link.label}
                  <Arrow direction="external" className="text-ink-muted" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-small text-ink-muted md:col-span-12">{t('rights', { year: new Date().getFullYear() })}</p>
      </Container>
    </footer>
  )
}
