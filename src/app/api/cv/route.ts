import { getPublicCv } from '@/lib/cv'

// The public CV behind every Download CV button, generated from the console's CV setup and the site's content.
// Rendered per request for now: its 7-day cache and the purge on every save belong to the SEO turn. See docs/cv.md#caching
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { pdf, fileName } = await getPublicCv()
    return new Response(new Uint8Array(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    })
  } catch (error) {
    console.error('Building the public CV failed:', error)
    return new Response('The CV is unavailable right now.', { status: 503 })
  }
}
