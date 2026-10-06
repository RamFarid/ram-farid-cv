import { buildLlmsTxt } from '@/lib/seo/llms'

// Static, regenerated daily; project saves revalidate it. See docs/seo.md#llmstxt
export const dynamic = 'force-static'
export const revalidate = 86400

export async function GET() {
  return new Response(await buildLlmsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
