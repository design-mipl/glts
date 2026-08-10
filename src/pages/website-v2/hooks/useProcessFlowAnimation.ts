import { useCallback, useEffect, useRef, useState } from 'react'

const LINE_MS = 600
const ICON_MS = 300
const PAUSE_MS = 200
const STEP_COUNT = 4
const SEGMENT_COUNT = STEP_COUNT - 1

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function useProcessFlowAnimation(stepCount = STEP_COUNT) {
  const sectionRef = useRef<HTMLElement>(null)
  const hasPlayedRef = useRef(false)
  const [completedIcons, setCompletedIcons] = useState(0)
  const [lineSegments, setLineSegments] = useState<number[]>(() =>
    Array.from({ length: stepCount - 1 }, () => 0),
  )

  const runSequence = useCallback(async () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const segmentCount = stepCount - 1

    if (reducedMotion) {
      setLineSegments(Array.from({ length: segmentCount }, () => 1))
      setCompletedIcons(stepCount)
      return
    }

    for (let i = 0; i < segmentCount; i++) {
      setLineSegments((prev) => {
        const next = [...prev]
        next[i] = 1
        return next
      })
      await wait(LINE_MS)
      setCompletedIcons(i + 1)
      await wait(ICON_MS)
      if (i < segmentCount - 1) await wait(PAUSE_MS)
    }

    setCompletedIcons(stepCount)
    await wait(ICON_MS)
  }, [stepCount])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasPlayedRef.current) return
        hasPlayedRef.current = true
        void runSequence()
      },
      { threshold: 0.3, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [runSequence])

  return {
    sectionRef,
    completedIcons,
    lineSegments,
  }
}

export const processFlowTiming = {
  lineMs: LINE_MS,
  iconMs: ICON_MS,
  pauseMs: PAUSE_MS,
  segmentCount: SEGMENT_COUNT,
} as const
