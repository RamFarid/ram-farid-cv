import { getPublicCv } from '@/lib/cv'

// The public CV behind every Download CV button, generated from the console's CV setup and the site's content.
// Rendered at build time and cached for 7 days; every save the CV reads from purges it (revalidatePath('/api/cv')).
// See docs/cv.md#caching
export const dynamic = 'force-static'
export const revalidate = 604800

export async function GET() {
  // A failure throws instead of answering an error: a 503 would be cached for 7 days, while a failed regeneration
  // keeps serving the last good CV.
  const { pdf, fileName } = await getPublicCv()
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  })
}
