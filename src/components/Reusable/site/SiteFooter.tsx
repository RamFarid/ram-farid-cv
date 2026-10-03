import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Container } from '@/components/ui/Container'
import { FooterChannels } from './ChannelLinks'

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
          <FooterChannels />
        </div>

        <p className="text-small text-ink-muted md:col-span-12">{t('rights', { year: new Date().getFullYear() })}</p>
      </Container>
    </footer>
  )
}
