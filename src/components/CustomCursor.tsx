'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 1500 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  const onMouseMove = useCallback((event: MouseEvent) => {
    const { clientX, clientY } = event
    // Check if the event coordinates are valid
    if (typeof clientX === 'number' && typeof clientY === 'number') {
      cursorX.set(clientX - 16)
      cursorY.set(clientY - 16)
      // Ensure cursor becomes visible when we detect valid mouse movement
      if (!isVisible) {
        setIsVisible(true)
      }
    }
  }, [cursorX, cursorY, isVisible])

  const onMouseEnter = useCallback(() => {
    // Only set visible if we're actually inside the window
    if (document.hasFocus()) {
      setIsVisible(true)
    }
  }, [])

  const onMouseLeave = useCallback(() => {
    setIsVisible(false)
  }, [])

  useEffect(() => {
    // Initial visibility check
    if (document.hasFocus() && typeof window !== 'undefined') {
      setIsVisible(true)
    }

    // Add events to window instead of document for better desktop support
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseenter', onMouseEnter)
    window.addEventListener('mouseleave', onMouseLeave)
    
    // Add focus/blur handlers for additional reliability
    window.addEventListener('focus', onMouseEnter)
    window.addEventListener('blur', onMouseLeave)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseenter', onMouseEnter)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('focus', onMouseEnter)
      window.removeEventListener('blur', onMouseLeave)
    }
  }, [onMouseMove, onMouseEnter, onMouseLeave])

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-cyan-500 pointer-events-none z-50"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        opacity: isVisible ? 1 : 0,
      }}
    />
  )
}