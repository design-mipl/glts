import { useEffect, useRef, useState } from 'react'

export function getScrollParent(node: HTMLElement | null): Element | null {
  if (!node) return null
  let parent = node.parentElement
  while (parent) {
    const { overflowY } = getComputedStyle(parent)
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      return parent
    }
    parent = parent.parentElement
  }
  return null
}

export function useStickyHeaderAtTop(transparentBackground: boolean) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    if (!transparentBackground) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const scrollRoot = getScrollParent(sentinel)
    const observer = new IntersectionObserver(
      ([entry]) => setIsAtTop(entry.isIntersecting),
      { root: scrollRoot, threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [transparentBackground])

  return {
    sentinelRef,
    showSolidBackground: !transparentBackground || !isAtTop,
  }
}
