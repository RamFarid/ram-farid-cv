'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import "@/styles/mark-down.css"
function MarkDown({ desc }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ node, ...props }) => (
          <div className='table-wrapper'>
            <table {...props} />
          </div>
        ),
      }}
      className='wrapper-mark__down'
    >
      {desc}
    </ReactMarkdown>
  )
}

export default MarkDown
