'use client'
import '@/styles/FS.css'
import React, { useEffect, useRef, useState } from 'react'

function FSWrapper({ frontFaceComponent, backFaceComponent }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const startX = useRef(0)
  const containerRef = useRef(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [onceAppeared, setOnceAppeared] = useState(false)

  const onTouchStart = (e) => {
    if (isIntersecting) setOnceAppeared(true)
    startX.current = e.changedTouches[0].clientX
  }
  const onTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX
    const deltaX = endX - startX.current

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        setIsFlipped(false)
      } else {
        setIsFlipped(true)
      }
    }
  }

  useEffect(() => {
    const container = containerRef.current
    const observer = new IntersectionObserver(
      ([entry]) =>
        setIsIntersecting((pre) => (!pre ? entry.isIntersecting : true)),
      { root: null, rootMargin: '0px', threshold: 1 }
    )
    observer.observe(container)

    return () => observer.unobserve(container)
  }, [])

  return (
    <div
      className='fs__container'
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      ref={containerRef}
    >
      <div
        className={`fs__content ${
          onceAppeared ? '' : isIntersecting ? 'sayImHere' : ''
        } ${isFlipped ? 'flip' : ''}`.trim()}
      >
        {frontFaceComponent &&
          React.cloneElement(frontFaceComponent, {
            className: `${
              frontFaceComponent?.props?.className || ''
            } fs__front-face`,
          })}
        {backFaceComponent &&
          React.cloneElement(backFaceComponent, {
            className: `${
              backFaceComponent?.props?.className || ''
            } fs__back-face`,
          })}
      </div>
    </div>
  )
}

export default FSWrapper
