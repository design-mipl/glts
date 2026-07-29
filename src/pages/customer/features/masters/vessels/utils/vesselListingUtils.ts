import type { VesselMaster } from '@/shared/types/vesselMaster'
import { vesselStatusLabel, vesselTypeLabel } from '../config/vesselTypeConfig'

export function getVesselCellValue(row: VesselMaster, key: string): string {
  if (key === 'lastUpdated') return formatVesselDate(row.updatedAt)
  if (key === 'status') return vesselStatusLabel[row.status]
  if (key === 'vesselType') return vesselTypeLabel[row.vesselType]
  return String((row as unknown as Record<string, unknown>)[key] ?? '')
}

export function matchesVesselSearch(row: VesselMaster, query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  return [
    row.vesselName,
    row.imoNumber,
    row.flagCountry,
    row.portOfRegistry,
    vesselTypeLabel[row.vesselType],
  ].some(part => part.toLowerCase().includes(normalized))
}

export function formatVesselDate(iso: string): string {
  if (!iso) return '--'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function mapVesselRowsToGridItems(rows: VesselMaster[]) {
  return rows.map(row => ({
    id: row.id,
    title: row.vesselName,
    subtitle: `IMO ${row.imoNumber}`,
    meta: `${vesselTypeLabel[row.vesselType]} · ${row.flagCountry || '--'}`,
    status: vesselStatusLabel[row.status],
    statusColor: row.status === 'active' ? ('success' as const) : ('default' as const),
  }))
}

export function downloadVesselCsv(rows: VesselMaster[]) {
  const headers = [
    'Vessel Name',
    'IMO',
    'Type',
    'Flag / Registered Country',
    'Port of Registry',
    'Status',
    'Last Updated',
  ]
  const lines = rows.map(row =>
    [
      row.vesselName,
      row.imoNumber,
      vesselTypeLabel[row.vesselType],
      row.flagCountry,
      row.portOfRegistry,
      vesselStatusLabel[row.status],
      formatVesselDate(row.updatedAt),
    ]
      .map(cell => `"${String(cell).replace(/"/g, '""')}"`)
      .join(','),
  )
  const csv = [headers.join(','), ...lines].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `vessel-master-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
