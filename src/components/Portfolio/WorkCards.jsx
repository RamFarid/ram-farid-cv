'use client'
import Link from 'next/link'
import Techs from './Techs'
import { useEffect, useState } from 'react'
import extractTechs from '@/utils/extractTechs'
import { motion } from 'framer-motion'

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
      delay: 0.6,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

function WorkCards({
  imgURL,
  title,
  demoURL,
  githubURL,
  usages,
  slug,
  starred,
}) {
  const [state, setState] = useState({ isHydrated: false, hash: '' })
  const { hasReact, hasNext } = extractTechs(usages)
  useEffect(() => {
    if (state.isHydrated)
      return setState((pre) => ({ ...pre, hash: window.location.hash }))
    else setState((pre) => ({ ...pre, isHydrated: true }))
  }, [state.isHydrated])
  return (
    <motion.div
      className={`portfolio-card-co ${
        state.hash.replace('#', '') === slug
          ? 'fouced'
          : starred
          ? 'starred'
          : ''
      }`.trim()}
      variants={variants}
      initial='hidden'
      animate='visible'
      exit='exit'
      id={slug}
    >
      <div className='img-co'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgURL} alt={title} />
      </div>
      <div className='title'>{title}</div>
      <Link
        href={`/portfolio/${slug}`}
        className='secondary-btn'
        scroll={false}
        style={{
          width: '100%',
        }}
      >
        More
      </Link>
      {hasReact || hasNext ? (
        <div className={`${hasNext ? 'next' : 'react'}-flag`}>
          <span>{hasReact ? 'React JS' : 'Next js'}</span>
        </div>
      ) : null}
      {starred && (
        <div className='star-flag'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src='/Assets/gold-common-star-svgrepo.svg' alt='star icon' />
        </div>
      )}
      <Techs usages={usages} />
    </motion.div>
  )
}

export default WorkCards
