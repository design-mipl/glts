import { useEffect, useRef, useState } from 'react'

const LINE_FADE_MS = 450
const STEP_REVEAL_MS = 300
const STEP_GAP_MS = 220

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/** One-time viewport reveal: line fades in, then steps appear left-to-right with a soft glow. */
export function useWorkflowRevealAnimation(stepCount = 4) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasPlayedRef = useRef(false)
  const [lineVisible, setLineVisible] = useState(false)
  const [revealedCount, setRevealedCount] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasPlayedRef.current) return
        hasPlayedRef.current = true

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reducedMotion) {
          setLineVisible(true)
          setRevealedCount(stepCount)
          return
        }

        void (async () => {
          setLineVisible(true)
          await wait(LINE_FADE_MS)
          for (let i = 0; i < stepCount; i++) {
            setRevealedCount(i + 1)
            if (i < stepCount - 1) await wait(STEP_REVEAL_MS + STEP_GAP_MS)
          }
        })()
      },
      { threshold: 0.28, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [stepCount])

  return { sectionRef, lineVisible, revealedCount }
}
