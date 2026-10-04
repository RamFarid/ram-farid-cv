import 'server-only'
import type { Element, Root, RootContent } from 'hast'
import type { Locale } from 'next-intl'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { isBucketUrl } from '@/lib/storage'

// Turns a story's Markdown into the sanitized HTML the case study renders as-is. It runs only in the save action, so
// visitors never download a Markdown parser. See docs/portfolio.md#story-html

// GitHub's sanitize schema (attributes, footnote ids, task-list checkboxes), narrowed to the story's elements. Raw
// HTML in the Markdown never gets this far: remark-rehype drops it.
const schema = {
  ...defaultSchema,
  tagNames: [
    ...['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'blockquote', 'pre', 'code'],
    ...['ul', 'ol', 'li', 'input', 'a', 'strong', 'em', 'del', 'sup', 'section', 'img'],
    ...['table', 'thead', 'tbody', 'tr', 'th', 'td'],
  ],
  protocols: { href: ['http', 'https', 'mailto'], src: ['https'] },
}

const footnoteLabels: Record<Locale, { footnoteLabel: string; footnoteBackLabel: string }> = {
  en: { footnoteLabel: 'Footnotes', footnoteBackLabel: 'Back to the text' },
  ar: { footnoteLabel: 'الحواشي', footnoteBackLabel: 'العودة إلى النص' },
}

/**
 * The story sits under an `h2` row heading, so `#` becomes `h3` and every deeper level `h4`. Images must come from our
 * R2 bucket, like every other image on the site.
 */
function rehypeStoryShape() {
  const shape = (parent: Root | Element) => {
    const children = (parent.children as RootContent[]).filter(
      (child) => !(child.type === 'element' && child.tagName === 'img' && !isBucketUrl(String(child.properties.src ?? ''))),
    )
    parent.children = children as typeof parent.children
    for (const child of children) {
      if (child.type !== 'element') continue
      const level = /^h([1-6])$/.exec(child.tagName)?.[1]
      if (level) child.tagName = level === '1' ? 'h3' : 'h4'
      shape(child)
    }
  }
  return (tree: Root) => shape(tree)
}

const processors = new Map<Locale, ReturnType<typeof createProcessor>>()

function createProcessor(locale: Locale) {
  return unified()
    .use(remarkParse)
    // `~~x~~` only, as in the editor; a single tilde stays text.
    .use(remarkGfm, { singleTilde: false })
    .use(remarkRehype, footnoteLabels[locale])
    .use(rehypeSanitize, schema)
    .use(rehypeStoryShape)
    .use(rehypeStringify)
}

/** Sanitized story HTML for one locale; empty Markdown gives an empty string. */
export async function storyHtml(markdown: string, locale: Locale) {
  if (!markdown.trim()) return ''
  let processor = processors.get(locale)
  if (!processor) {
    processor = createProcessor(locale)
    processors.set(locale, processor)
  }
  return String(await processor.process(markdown))
}
