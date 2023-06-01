import contactLinks from '@/public/data/contactLinks'
import React from 'react'
import SmallCards from '../reusables/SmallCards'

function SocialCards() {
  return (
    <div className='cards-side'>
      {contactLinks.map((link, id) => (
        <SmallCards
          icon={link.icon}
          head={link.head}
          sub={
            Array.isArray(link.sub) ? (
              link.sub.map((tag, id) => (
                <a
                  key={id + 5}
                  href={tag.href}
                  target='_blank'
                  style={{ display: 'block' }}
                  rel='noreferrer'
                >
                  {tag.text}
                </a>
              ))
            ) : (
              <a href={link.sub.href} target='_blank' rel='noreferrer'>
                {link.sub.text}
              </a>
            )
          }
          key={id + 7}
        />
      ))}
    </div>
  )
}

export default SocialCards
