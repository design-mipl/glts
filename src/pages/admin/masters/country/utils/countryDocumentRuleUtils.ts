import type {
  CountryJurisdictionDocumentRule,
  JurisdictionDocumentGroup,
} from '@/shared/types/countryMaster'

export function documentsForGroup(
  documents: CountryJurisdictionDocumentRule[],
  group: JurisdictionDocumentGroup,
): CountryJurisdictionDocumentRule[] {
  return [...documents]
    .filter((document) => document.group === group)
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function buildReorderedDocumentIds(
  allDocuments: CountryJurisdictionDocumentRule[],
  group: JurisdictionDocumentGroup,
  fromIndex: number,
  direction: 'up' | 'down',
): string[] | null {
  const sorted = [...allDocuments].sort((a, b) => a.sortOrder - b.sortOrder)
  const groupMembers = sorted.filter((document) => document.group === group)
  const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1
  if (toIndex < 0 || toIndex >= groupMembers.length) return null

  const reorderedGroup = [...groupMembers]
  ;[reorderedGroup[fromIndex], reorderedGroup[toIndex]] = [
    reorderedGroup[toIndex],
    reorderedGroup[fromIndex],
  ]

  let groupCursor = 0
  return sorted.map((document) => {
    if (document.group === group) {
      return reorderedGroup[groupCursor++].id
    }
    return document.id
  })
}
