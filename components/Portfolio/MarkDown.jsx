'use client'
import ReactMarkdown from 'react-markdown'
import remarkReact from 'remark-react'

function MarkDown({ desc }) {
  // const customHeaderRender = (level) => {
  //   return function noName({ children }) {
  //     const HeaderTag = `h${level}`
  //     return <h1 className='header'>{children}</h1>
  //   }
  // }
  // const customRenderers = {
  //   h1: customHeaderRender(1),
  //   h2: customHeaderRender(2),
  //   h3: customHeaderRender(3),
  //   h4: customHeaderRender(4),
  //   h5: customHeaderRender(5),
  //   h6: customHeaderRender(6),
  // }
  return <ReactMarkdown>{desc}</ReactMarkdown>
}

export default MarkDown
