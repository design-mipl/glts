import { useEffect, useRef, useState } from 'react'

/**
 * Detects when a sticky element is stuck (scrolled past its natural position).
 * Place the returned sentinel above the sticky target.
 */
export function useStickyStuck() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting)
      },
      { threshold: [0, 1] },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [])

  return { sentinelRef, stuck }
}
