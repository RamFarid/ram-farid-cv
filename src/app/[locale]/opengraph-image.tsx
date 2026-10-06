import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { CSSProperties } from 'react'
import { ImageResponse } from 'next/og'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { localeDirection, routing } from '@/i18n/routing'
import { socialCard } from '@/lib/seo/metadata'

// The social card for every page in a locale; a case study overrides it with the project's cover. Built at build time.
// See docs/seo.md#social-cards

const size = { width: socialCard.width, height: socialCard.height }

// ImageResponse can't read CSS variables: these are the dark theme's tokens (docs/design-system/tokens.json).
const color = {
  bg: '#0b0910',
  ink: '#f3f0f8',
  inkMuted: '#9d95ae',
  line: '#2b2538',
  primary: '#a25bff',
  primaryInk: '#be8cff',
}

async function localeOf(params: Promise<{ locale: string }>) {
  const { locale } = await params
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale
}

export async function generateImageMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations({ locale: await localeOf(params), namespace: 'Metadata' })
  return [{ id: socialCard.id, alt: t('image.alt'), size, contentType: 'image/png' }]
}

/**
 * Satori shapes Arabic letters but lays words out left to right, so an Arabic phrase would read backwards. Each Arabic
 * word becomes its own item and Latin words stay together in runs; the flex direction then puts them in reading order.
 */
function Line({ text, rtl, style }: { text: string; rtl: boolean; style?: CSSProperties }) {
  const items: string[] = []
  let latinRun = false
  for (const word of text.split(' ')) {
    const arabic = /[؀-ۿ]/.test(word)
    if (!arabic && latinRun) items[items.length - 1] += ` ${word}`
    else items.push(word)
    latinRun = !arabic
  }

  return (
    <div style={{ display: 'flex', flexDirection: rtl ? 'row-reverse' : 'row', gap: '0.22em', ...style }}>
      {items.map((item, index) => (
        <span key={index}>{item}</span>
      ))}
    </div>
  )
}

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await localeOf(params)
  const rtl = localeDirection[locale] === 'rtl'
  const [t, regular, semiBold, icon] = await Promise.all([
    getTranslations({ locale, namespace: 'Metadata' }),
    readFile(join(process.cwd(), 'src/fonts/og/ReadexPro-Regular.ttf')),
    readFile(join(process.cwd(), 'src/fonts/og/ReadexPro-SemiBold.ttf')),
    readFile(join(process.cwd(), 'public/brand/ram-icon.svg'), 'base64'),
  ])
  const align = rtl ? 'flex-end' : 'flex-start'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: align,
          width: '100%',
          height: '100%',
          padding: '72px 80px',
          backgroundColor: color.bg,
          backgroundImage: `radial-gradient(circle at 1px 1px, ${color.line} 1.5px, transparent 0)`,
          backgroundSize: '32px 32px',
          borderBottom: `16px solid ${color.primary}`,
          color: color.ink,
          fontFamily: 'Readex Pro',
        }}
      >
        <div style={{ display: 'flex', flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> only */}
          <img src={`data:image/svg+xml;base64,${icon}`} width={88} height={88} alt="" />
          <span style={{ fontSize: 32, color: color.inkMuted }}>ramfarid.com</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: align, gap: 12 }}>
          <Line text={t('name')} rtl={rtl} style={{ fontSize: 112, fontWeight: 600, lineHeight: 1.1 }} />
          <Line text={t('jobTitle')} rtl={rtl} style={{ fontSize: 48, fontWeight: 600, color: color.primaryInk }} />
          <Line text={t('image.tagline')} rtl={rtl} style={{ fontSize: 40, color: color.inkMuted, marginTop: 12 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: rtl ? 'row-reverse' : 'row', gap: 40, fontSize: 30, color: color.inkMuted }}>
          <Line text={t('image.stack')} rtl={rtl} />
          <Line text={t('image.place')} rtl={rtl} />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Readex Pro', data: regular, weight: 400 },
        { name: 'Readex Pro', data: semiBold, weight: 600 },
      ],
    },
  )
}
