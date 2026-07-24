import { useCallback, useEffect, useMemo, useState } from 'react'
import { CommandPalette, type SearchResults } from '@/design-system/UIComponents'
import type { ExecutiveSearchItem } from '../types'
import { useDrilldownOptional } from '../drilldown'
import { useScrollSpy } from '../navigation/useScrollSpy'

export interface ExecutiveSearchProps {
  items: ExecutiveSearchItem[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Enable Ctrl/Cmd + K hotkey. Default true. */
  hotkey?: boolean
}

function toPaletteResults(items: ExecutiveSearchItem[], query: string): SearchResults {
  const q = query.trim().toLowerCase()
  const matched = items.filter(
    (item) =>
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.category.includes(q),
  )

  const pages = matched
    .filter((item) => item.category === 'section' || item.category === 'action' || item.category === 'report')
    .map((item) => ({
      id: item.id,
      type: 'page' as const,
      title: item.title,
      subtitle: item.subtitle ?? item.category,
      href: item.href,
      onClick: item.onSelect,
    }))

  const records = matched
    .filter((item) =>
      ['client', 'country', 'application', 'revenue', 'marine'].includes(item.category),
    )
    .map((item) => ({
      id: item.id,
      type: 'record' as const,
      title: item.title,
      subtitle: item.subtitle ?? item.category,
      href: item.href,
      onClick: item.onSelect,
    }))

  const users = matched
    .filter((item) => item.category === 'employee')
    .map((item) => ({
      id: item.id,
      type: 'user' as const,
      title: item.title,
      subtitle: item.subtitle ?? 'Employee',
      href: item.href,
      onClick: item.onSelect,
    }))

  return { pages, records, users }
}

/**
 * Ctrl/Cmd+K executive command search — reuses DS CommandPalette.
 */
export function ExecutiveSearch({
  items,
  open: controlledOpen,
  onOpenChange,
  hotkey = true,
}: ExecutiveSearchProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen
  const drilldown = useDrilldownOptional()

  useEffect(() => {
    if (!hotkey) return
    const onKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac')
      const mod = isMac ? event.metaKey : event.ctrlKey
      if (mod && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [hotkey, setOpen])

  const onSearch = useCallback(
    async (query: string): Promise<SearchResults> => toPaletteResults(items, query),
    [items],
  )

  // Wire section jumps when items carry section ids via onSelect from callers.
  void drilldown

  return <CommandPalette open={open} onClose={() => setOpen(false)} onSearch={onSearch} />
}

export function useExecutiveSearchHotkey(onOpen: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac')
      const mod = isMac ? event.metaKey : event.ctrlKey
      if (mod && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onOpen()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled, onOpen])
}

export function buildSectionSearchItems(
  sections: Array<{ id: string; label: string }>,
  scrollToSection: (id: string) => void,
): ExecutiveSearchItem[] {
  return sections.map((section) => ({
    id: `section-${section.id}`,
    title: section.label,
    subtitle: 'Jump to section',
    category: 'section',
    onSelect: () => scrollToSection(section.id),
  }))
}

/** Tiny helper when a page already uses scroll spy. */
export function useSectionSearchItems(sections: Array<{ id: string; label: string }>) {
  const { scrollToSection } = useScrollSpy({ sections })
  return useMemo(
    () => buildSectionSearchItems(sections, scrollToSection),
    [scrollToSection, sections],
  )
}
