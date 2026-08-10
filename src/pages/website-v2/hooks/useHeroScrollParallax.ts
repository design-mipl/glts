import { useEffect, useRef, useState } from 'react'

const MAX_OFFSET_PX = 28

/** Gentle scroll-linked parallax for hero visuals — disabled when reduced motion is preferred. */
export function useHeroScrollParallax() {
  const sectionRef = useRef<HTMLElement>(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const update = () => {
      const el = sectionRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const visible = rect.bottom > 0 && rect.top < window.innerHeight
      if (!visible) return

      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)))
      setOffsetY(progress * MAX_OFFSET_PX)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return { sectionRef, offsetY }
}
