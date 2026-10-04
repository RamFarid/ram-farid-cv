import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

// Private: never indexed (docs/seo.md). Every page below checks the session itself; see docs/console.md#sign-in
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Console.meta')
  return {
    title: { template: `%s · ${t('title')}`, default: t('title') },
    robots: { index: false, follow: false },
  }
}

export default function ConsoleRootLayout({ children }: LayoutProps<'/[locale]/console'>) {
  return children
}
