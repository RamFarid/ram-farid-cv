import contactLinks from '../../../public/data/contactLinks'
import React from 'react'
import SmallCards from '../reusables/SmallCards'

function SocialCards({ className = '', socialLinks }) {
  return (
    <div className={`${className}`} style={{ padding: '6px' }}>
      <h2 className='section-header'>Social accounts</h2>
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
                    href={socialLinks[link.id][id]}
                    target='_blank'
                    style={{ display: 'block' }}
                    rel='noreferrer'
                  >
                    {socialLinks[link.id][id]}
                  </a>
                ))
              ) : (
                <a href={socialLinks[link.id]} target='_blank' rel='noreferrer'>
                  {socialLinks[link.id]}
                </a>
              )
            }
            key={id + 7}
          />
        ))}
      </div>
    </div>
  )
}

export default SocialCards
