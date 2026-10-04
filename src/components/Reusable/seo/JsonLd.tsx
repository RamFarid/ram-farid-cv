// `<` is escaped so a string in the data can't close the script tag (node_modules/next/dist/docs/01-app/02-guides/json-ld.md).
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
  )
}
