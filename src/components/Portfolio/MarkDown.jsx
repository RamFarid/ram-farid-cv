'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function MarkDown({ desc }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{desc}</ReactMarkdown>
}

export default MarkDown
