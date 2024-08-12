'use client'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
    >
      {desc}
    </ReactMarkdown>
  )
}

export default MarkDown
