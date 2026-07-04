import type {
  CountryQcChecklistItem,
  CountryQcChecklistSection,
  CountryQcChecklistTemplate,
} from '@/shared/types/countryMaster'

export function generateQcChecklistSectionId(): string {
  return `qc-section-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function generateQcChecklistItemId(): string {
  return `qc-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function cloneQcChecklistTemplate(template: CountryQcChecklistTemplate): CountryQcChecklistTemplate {
  return structuredClone(template)
}

function sortByOrder<T extends { sortOrder: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function normalizeQcChecklistTemplate(template: CountryQcChecklistTemplate): CountryQcChecklistTemplate {
  const sections = sortByOrder(template.sections).map((section, sectionIndex) => ({
    ...section,
    sortOrder: sectionIndex,
    items: sortByOrder(section.items).map((item, itemIndex) => ({
      ...item,
      sortOrder: itemIndex,
    })),
  }))
  return { ...template, sections }
}

export function countEnabledQcChecklistSections(template: CountryQcChecklistTemplate): number {
  return template.sections.filter((section) => section.enabled).length
}

export function countEnabledQcChecklistItems(template: CountryQcChecklistTemplate): number {
  return template.sections
    .filter((section) => section.enabled)
    .reduce((total, section) => total + section.items.filter((item) => item.enabled).length, 0)
}

export function getExecutableQcChecklistSections(
  template: CountryQcChecklistTemplate,
): CountryQcChecklistSection[] {
  return sortByOrder(template.sections)
    .filter((section) => section.enabled)
    .map((section) => ({
      ...section,
      items: sortByOrder(section.items).filter((item) => item.enabled),
    }))
    .filter((section) => section.items.length > 0)
}

export function reorderQcChecklistSections(
  sections: CountryQcChecklistSection[],
  sectionId: string,
  direction: 'up' | 'down',
): CountryQcChecklistSection[] {
  const ordered = sortByOrder(sections)
  const index = ordered.findIndex((section) => section.id === sectionId)
  if (index < 0) return sections
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= ordered.length) return sections
  const next = [...ordered]
  ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
  return next.map((section, sortOrder) => ({ ...section, sortOrder }))
}

export function reorderQcChecklistItems(
  section: CountryQcChecklistSection,
  itemId: string,
  direction: 'up' | 'down',
): CountryQcChecklistItem[] {
  const ordered = sortByOrder(section.items)
  const index = ordered.findIndex((item) => item.id === itemId)
  if (index < 0) return section.items
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= ordered.length) return section.items
  const next = [...ordered]
  ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
  return next.map((item, sortOrder) => ({ ...item, sortOrder }))
}
