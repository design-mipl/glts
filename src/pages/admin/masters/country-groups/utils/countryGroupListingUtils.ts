import type { CountryGroupMaster } from '@/shared/types/countryGroupMaster'
import { countryGroupMasterService } from '@/shared/services/countryGroupMasterService'
import { masterStatusLabel } from '../../config/masterStatusConfig'

export function formatCountryGroupCountriesPreview(countryIds: string[], maxVisible = 2): string {
  const names = countryGroupMasterService.resolveCountryNames(countryIds)
  if (!names.length) return '—'
  if (names.length <= maxVisible) return names.join(', ')
  const visible = names.slice(0, maxVisible).join(', ')
  return `${visible} +${names.length - maxVisible}`
}

export function getCountryGroupCellValue(row: CountryGroupMaster, key: string): string {
  if (key === 'status') return masterStatusLabel[row.status]
  if (key === 'countries') return formatCountryGroupCountriesPreview(row.countryIds, 99)
  if (key === 'createdAudit') return row.createdAt
  if (key === 'updatedAudit') return row.updatedAt
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesCountryGroupSearch(row: CountryGroupMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  const countryNames = countryGroupMasterService.resolveCountryNames(row.countryIds)
  return [
    row.name,
    row.status,
    masterStatusLabel[row.status],
    ...countryNames,
  ].some((part) => part.toLowerCase().includes(normalized))
}

export function getCountryGroupEmptyState(onCreate: () => void) {
  return {
    emptyTitle: 'No country groups found',
    emptyDescription: 'Create a named group and map existing countries for quotation visa pricing.',
    emptyAction: { label: 'Add country group', onClick: onCreate },
  }
}

export function downloadCountryGroupCsv(rows: CountryGroupMaster[]) {
  const headers = ['Group Name', 'Countries', 'Status']
  const lines = rows.map((row) => {
    const countries = countryGroupMasterService.resolveCountryNames(row.countryIds).join('; ')
    return [row.name, countries, masterStatusLabel[row.status]]
      .map((cell) => `"${cell}"`)
      .join(',')
  })
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `country-groups-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
