'use client'

import React, { useEffect, useRef, useState } from 'react'

function SliderWrapper({ children, activeItem, setActiveItem }) {
  const itemsLength = React.Children.count(children)
  const animationTimeID = useRef(null)
  const startY = useRef(22)
  const containerRef = useRef(null)
  useEffect(() => {
    window.document.documentElement.style.setProperty(
      '--net-viewport',
      `${window.innerHeight}px`
    )
  }, [])

  useEffect(() => {
    const handleScrollSections = (event) => {
      const isLastItem = activeItem + 1 === itemsLength
      if (!isLastItem || (isLastItem && animationTimeID.current)) {
        containerRef.current.scrollIntoView()
        event.preventDefault()
      }
    }
    const onTouchStart = (e) => {
      handleScrollSections(e)
      startY.current = e.changedTouches[0].clientY
    }
    const onTouchMove = (e) => handleScrollSections(e)
    const onTouchEnd = (e) => {
      if (animationTimeID.current) return
      const endY = e.changedTouches[0].clientY
      const deltaY = endY - startY.current

      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          if (activeItem === 0) return
          setActiveItem((pre) => pre - 1)
        } else {
          if (activeItem + 1 === itemsLength) return
          setActiveItem((pre) => pre + 1)
        }
      }
      animationTimeID.current = setTimeout(() => {
        animationTimeID.current = null
      }, 700)
    }
    const onWheel = (e) => {
      const { deltaY } = e
      const isLastItem = activeItem + 1 === itemsLength
      const isFirstItem = activeItem === 0
      handleScrollSections(e)
      if (animationTimeID.current) return
      if (deltaY > 0) {
        if (isLastItem) return
        setActiveItem((pre) => pre + 1)
      } else {
        if (isFirstItem) return
        setActiveItem((pre) => pre - 1)
      }
      animationTimeID.current = setTimeout(() => {
        animationTimeID.current = null
      }, 700)
    }
    const container = containerRef.current
    container.addEventListener('wheel', onWheel, { passive: false })
    container.addEventListener('touchstart', onTouchStart, { passive: false })
    container.addEventListener('touchmove', onTouchMove, { passive: false })
    container.addEventListener('touchend', onTouchEnd, { passive: false })
    return () => {
      container.removeEventListener('wheel', onWheel)
      container.removeEventListener('touchstart', onTouchStart)
      container.removeEventListener('touchmove', onTouchMove)
      container.removeEventListener('touchend', onTouchEnd)
    }
  }, [activeItem, itemsLength, setActiveItem])

  return (
    <div className='scroller__container' ref={containerRef}>
      <div
        className='scroller__content'
        style={{
          transform: `translateY(calc(-${activeItem} * var(--net-viewport, 100vh)))`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default SliderWrapper
