import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Project covers and screenshots are served from R2's public URL. See docs/portfolio.md#images
const r2PublicUrl = process.env.R2_PUBLIC_URL?.replace(/\/$/, '')

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: r2PublicUrl ? [new URL(`${r2PublicUrl}/**`)] : [],
  },
}

// Picks up src/i18n/request.ts by convention.
const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
