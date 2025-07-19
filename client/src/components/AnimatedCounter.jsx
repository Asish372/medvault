import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const AnimatedCounter = ({ 
  value, 
  duration = 2000, 
  delay = 0,
  prefix = '',
  suffix = '' 
}) => {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Element is visible - start animation
          setIsVisible(true)
          startAnimation()
        } else {
          // Element is not visible - reset for next time
          setIsVisible(false)
          setCount(0)
          setIsAnimating(false)
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
          }
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation slightly before element is fully visible
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration, delay])

  const startAnimation = () => {
    const timer = setTimeout(() => {
      setIsAnimating(true)
      
      let startTime = null
      const startValue = 0
      const endValue = parseInt(value) || 0

      const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime
        const timeElapsed = currentTime - startTime
        const progress = Math.min(timeElapsed / duration, 1)

        const easedProgress = easeOutQuart(progress)
        const currentCount = Math.floor(easedProgress * (endValue - startValue) + startValue)

        setCount(currentCount)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          setCount(endValue)
          setIsAnimating(false)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timer)
  }

  return (
    <motion.span
      ref={elementRef}
      className={`inline-block ${isAnimating ? 'text-blue-600 dark:text-blue-400' : ''} transition-colors duration-300`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8 
      }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{count}{suffix}
    </motion.span>
  )
}

export default AnimatedCounter
