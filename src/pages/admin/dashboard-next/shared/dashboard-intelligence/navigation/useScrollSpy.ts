import { useCallback, useEffect, useState } from 'react'
import type { ExecutiveSectionNavItem } from '../types'

export interface UseScrollSpyOptions {
  sections: ExecutiveSectionNavItem[]
  offsetPx?: number
}

export function useScrollSpy({ sections, offsetPx = 120 }: UseScrollSpyOptions) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    if (sections.length === 0) return

    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      {
        rootMargin: `-${offsetPx}px 0px -45% 0px`,
        threshold: [0.15, 0.35, 0.55],
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [offsetPx, sections])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveId(id)
  }, [])

  return { activeId, setActiveId, scrollToSection }
}

/** When a segment filter is selected, jump to the matching section if configured. */
export function useSegmentSectionFocus(
  segment: string,
  sections: ExecutiveSectionNavItem[],
  scrollToSection: (id: string) => void,
) {
  useEffect(() => {
    if (!segment || segment === 'all') return
    const match = sections.find((section) => section.segmentFocus === segment)
    if (match) {
      const timer = window.setTimeout(() => scrollToSection(match.id), 180)
      return () => window.clearTimeout(timer)
    }
  }, [scrollToSection, sections, segment])
}
