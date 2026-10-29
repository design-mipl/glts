import { useEffect, useRef, useState } from 'react'
import { useMediaQuery } from '@mui/material'

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
}

/** Once-only scroll-triggered reveal. Fires `active=true` when the element enters the viewport. */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
) {
  const { threshold = 0.2, rootMargin = '0px 0px -8% 0px' } = options
  const ref = useRef<T>(null)
  const playedRef = useRef(false)
  const [active, setActive] = useState(false)
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reducedMotion) {
      setActive(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || playedRef.current) return
        playedRef.current = true
        setActive(true)
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, reducedMotion])

  return { ref, active, reducedMotion }
}
