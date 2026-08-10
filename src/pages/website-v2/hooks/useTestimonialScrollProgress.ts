import { useEffect, useRef, useState, type RefObject } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

const SPRING = { stiffness: 110, damping: 28, mass: 0.35, restDelta: 0.0008 }

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export type ScrollDirection = 'forward' | 'backward'

interface UseTestimonialScrollProgressOptions {
  sectionRef: RefObject<HTMLElement | null>
  enabled: boolean
}

export function useTestimonialScrollProgress({
  sectionRef,
  enabled,
}: UseTestimonialScrollProgressOptions) {
  const rawProgress = useMotionValue(0)
  const smoothProgress = useSpring(rawProgress, SPRING)
  const directionRef = useRef<ScrollDirection>('forward')
  const [direction, setDirection] = useState<ScrollDirection>('forward')

  useEffect(() => {
    if (!enabled) {
      rawProgress.set(0)
      return
    }

    const update = () => {
      const el = sectionRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const sectionTop = window.scrollY + rect.top
      const pinSpan = Math.max(el.offsetHeight - window.innerHeight, 1)
      const scrolled = window.scrollY - sectionTop
      const next = clamp(scrolled / pinSpan, 0, 1)

      const prev = rawProgress.get()
      if (next < prev - 0.0005) {
        if (directionRef.current !== 'backward') {
          directionRef.current = 'backward'
          setDirection('backward')
        }
      } else if (next > prev + 0.0005) {
        if (directionRef.current !== 'forward') {
          directionRef.current = 'forward'
          setDirection('forward')
        }
      }

      rawProgress.set(next)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [enabled, sectionRef, rawProgress])

  return { smoothProgress, direction }
}

export function useVisibleTestimonialCount() {
  const [count, setCount] = useState(3)

  useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1200px)')
    const mqSm = window.matchMedia('(min-width: 600px)')

    const resolve = () => {
      if (mqLg.matches) setCount(3)
      else if (mqSm.matches) setCount(2)
      else setCount(1)
    }

    resolve()
    mqLg.addEventListener('change', resolve)
    mqSm.addEventListener('change', resolve)
    return () => {
      mqLg.removeEventListener('change', resolve)
      mqSm.removeEventListener('change', resolve)
    }
  }, [])

  return count
}
