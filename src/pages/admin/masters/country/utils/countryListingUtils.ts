import type { BusinessSegment, CountryMaster } from '@/shared/types/countryMaster'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import {
  COUNTRY_STATUS_LABELS,
  PROCESSING_TYPE_LABELS,
} from '../config/countryProcessingConfig'
import { SEGMENT_LABELS, type CountryListingTab } from '../config/countrySegmentConfig'

export function filterCountryRowsByTab(
  rows: CountryMaster[],
  tab: CountryListingTab,
): CountryMaster[] {
  if (tab === 'all') return rows
  return rows.filter((row) =>
    row.segments.some((s) => s.segment === tab && s.enabled),
  )
}

export function getCountryCellValue(
  row: CountryMaster,
  key: string,
  listingSegment?: BusinessSegment,
): string {
  if (key === 'name') return row.name
  if (key === 'code') return row.code
  if (key === 'status') return COUNTRY_STATUS_LABELS[row.status]
  if (key === 'processingType') return PROCESSING_TYPE_LABELS[row.processingType]
  if (key === 'updatedAt') return row.updatedAt
  if (key === 'visaTypeCount') {
    const agg = countryMasterAdminService.getAggregates(row, listingSegment)
    return String(agg.visaTypeCount).padStart(6, '0')
  }
  if (key === 'checklistCount') {
    const agg = countryMasterAdminService.getAggregates(row, listingSegment)
    return String(agg.checklistCount)
  }
  if (key === 'segments') {
    return countryMasterAdminService
      .getEnabledSegments(row)
      .map((s) => SEGMENT_LABELS[s])
      .join(', ')
  }
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesCountrySearch(row: CountryMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    row.name,
    row.code,
    row.region,
    row.cities,
    row.embassyNotes ?? '',
    row.internalNotes ?? '',
  ].some((part) => part.toLowerCase().includes(normalized))
}

export function formatCountryDate(iso: string): string {
  if (!iso) return '--'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function mapCountryRowsToGridItems(
  rows: CountryMaster[],
  listingSegment?: BusinessSegment,
) {
  return rows.map((row) => {
    const agg = countryMasterAdminService.getAggregates(row, listingSegment)
    return {
      id: row.id,
      title: `${row.flag} ${row.name}`,
      subtitle: countryMasterAdminService.getEnabledSegments(row).map((s) => SEGMENT_LABELS[s]).join(' · ') || 'No segments',
      meta: `${agg.visaTypeCount} visa types · ${formatCountryDate(row.updatedAt)}`,
      status: COUNTRY_STATUS_LABELS[row.status],
      statusColor:
        row.status === 'active'
          ? ('success' as const)
          : row.status === 'draft'
            ? ('warning' as const)
            : ('default' as const),
    }
  })
}

export interface CountryListingEmptyState {
  emptyTitle: string
  emptyDescription: string
  emptyAction?: { label: string; onClick: () => void }
}

export function getCountryEmptyState(
  tab: CountryListingTab,
  onCreate: () => void,
): CountryListingEmptyState {
  if (tab === 'all') {
    return {
      emptyTitle: 'No countries configured',
      emptyDescription: 'Add a country to configure visa types, checklists, and processing rules.',
      emptyAction: { label: 'Add country', onClick: onCreate },
    }
  }
  const label = SEGMENT_LABELS[tab]
  return {
    emptyTitle: `No ${label} countries`,
    emptyDescription: `Enable ${label} on an existing country or add a new country with ${label} support.`,
    emptyAction: { label: 'Add country', onClick: onCreate },
  }
}

export function downloadCountryCsv(
  rows: CountryMaster[],
  listingSegment?: BusinessSegment,
) {
  const headers = [
    'Country',
    'Code',
    'Segments',
    'Visa Types',
    'Checklists',
    'Processing Type',
    'Status',
    'Last Updated',
  ]
  const lines = rows.map((row) => {
    const agg = countryMasterAdminService.getAggregates(row, listingSegment)
    return [
      row.name,
      row.code,
      countryMasterAdminService.getEnabledSegments(row).join('; '),
      String(agg.visaTypeCount),
      String(agg.checklistCount),
      PROCESSING_TYPE_LABELS[row.processingType],
      COUNTRY_STATUS_LABELS[row.status],
      formatCountryDate(row.updatedAt),
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(',')
  })
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `country-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
