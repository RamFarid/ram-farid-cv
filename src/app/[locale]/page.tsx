import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

// Placeholder until the home page is built; doubles as a smoke test for tokens, fonts and both locales.
export default async function Home() {
  const t = await getTranslations('Home')

  return (
    <main className="dot-grid flex flex-1 items-center justify-center px-space-4 md:px-space-6">
      <div className="flex max-w-measure flex-col gap-space-5 rounded-lg border border-line bg-surface p-space-5 shadow-md">
        <Image src="/brand/ram-logo-on-dark.svg" alt="Ram Farid" width={80} height={81} priority />
        <p className="font-mono text-eyebrow text-primary-ink uppercase">{t('eyebrow')}</p>
        <h1 className="text-h1 md:text-display">{t('headline')}</h1>
        <p className="text-body-lg text-ink-muted">
          {t.rich('intro', {
            code: (chunks) => <code className="font-mono text-code text-ink">{chunks}</code>,
          })}
        </p>
        <button className="self-start rounded-md bg-primary px-space-4 py-space-3 text-label text-on-primary transition-colors hover:bg-primary-hover hover:shadow-glow">
          {t('cta')}
        </button>
      </div>
    </main>
  )
}
