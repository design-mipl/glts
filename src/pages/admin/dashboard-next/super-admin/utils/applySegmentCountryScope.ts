import type { MarineTimelineRow } from '../../shared/widgets/operations/MarineTimeline'
import type {
  SuperAdminAcquisitionFunnel,
  SuperAdminDashboardData,
  SuperAdminDestinationMixItem,
  SuperAdminRankItem,
  SuperAdminSegmentCommercialKpis,
  SuperAdminVerticalPreview,
} from '../types'

export type SegmentCountryKey = 'all' | 'uae' | 'schengen' | 'uk' | 'us'

export function normalizeSegmentCountry(value: string | undefined): SegmentCountryKey {
  const v = (value ?? 'all').toLowerCase()
  if (v === 'uae' || v === 'schengen' || v === 'uk' || v === 'us') return v
  return 'all'
}

export function destinationLabelToCountryKey(label: string): SegmentCountryKey | null {
  const n = label.trim().toLowerCase()
  if (n === 'uae' || n.includes('united arab')) return 'uae'
  if (n.includes('schengen')) return 'schengen'
  if (n === 'uk' || n.includes('united kingdom')) return 'uk'
  if (n === 'usa' || n === 'us' || n.includes('united states')) return 'us'
  return null
}

export function destinationCountryKey(item: SuperAdminDestinationMixItem): SegmentCountryKey | null {
  if (item.countryKey) return normalizeSegmentCountry(item.countryKey)
  return destinationLabelToCountryKey(item.label)
}

function formatLakhs(n: number): string {
  return `₹${n.toFixed(1)}L`
}

function filterDestinations(
  items: SuperAdminDestinationMixItem[],
  country: SegmentCountryKey,
): SuperAdminDestinationMixItem[] {
  if (country === 'all') return items
  return items.filter((item) => destinationCountryKey(item) === country)
}

function destinationShare(
  items: SuperAdminDestinationMixItem[],
  country: SegmentCountryKey,
): number {
  if (country === 'all') return 1
  const total = items.reduce((sum, item) => sum + item.volume, 0)
  if (total <= 0) return 0
  const selected = items.find((item) => destinationCountryKey(item) === country)
  return selected ? selected.volume / total : 0
}

function selectedDestination(
  items: SuperAdminDestinationMixItem[],
  country: SegmentCountryKey,
): SuperAdminDestinationMixItem | undefined {
  if (country === 'all') return undefined
  return items.find((item) => destinationCountryKey(item) === country)
}

function scopeCommercialKpis(
  kpis: SuperAdminSegmentCommercialKpis,
  destinations: SuperAdminDestinationMixItem[],
  country: SegmentCountryKey,
): SuperAdminSegmentCommercialKpis {
  if (country === 'all') return kpis

  const dest = selectedDestination(destinations, country)
  if (!dest) {
    return {
      ...kpis,
      totalApplications: 0,
      repeatApplications: 0,
      repeatEligibleApplications: 0,
      revenue: {
        today: { ...kpis.revenue.today, value: '₹0.0L' },
        mtd: { ...kpis.revenue.mtd, value: '₹0.0L' },
        ytd: { ...kpis.revenue.ytd, value: '₹0.0L' },
      },
      grossMarginPercent: '—',
      approvalPercent: '—',
      outstanding: '₹0.0L',
      collections: '₹0.0L',
      pipelineValue: '₹0.0L',
      repeatRatePercent: '—',
    }
  }

  const ytdMultiplier = kpis.revenue.ytd.value.includes('Cr') ? 9.2 : 8

  return {
    ...kpis,
    revenue: {
      today: {
        ...kpis.revenue.today,
        value: formatLakhs(dest.revenueL * 0.038),
      },
      mtd: {
        ...kpis.revenue.mtd,
        value: formatLakhs(dest.revenueL),
      },
      ytd: {
        ...kpis.revenue.ytd,
        value: formatLakhs(dest.revenueL * ytdMultiplier),
      },
    },
    grossMarginPercent: `${dest.marginPct.toFixed(1)}%`,
    totalApplications: dest.volume,
    approvalPercent: `${dest.approvalPct}%`,
    outstanding: formatLakhs(dest.revenueL * 0.38),
    collections: formatLakhs(dest.revenueL * 0.72),
    pipelineValue: formatLakhs(dest.revenueL * 0.48),
    repeatApplications: Math.max(
      0,
      Math.round((kpis.repeatApplications ?? 0) * (dest.volume / Math.max(1, Number(kpis.totalApplications) || dest.volume))),
    ),
    repeatEligibleApplications: dest.volume,
  }
}

function scopeFunnel(
  funnel: SuperAdminAcquisitionFunnel,
  share: number,
): SuperAdminAcquisitionFunnel {
  if (share >= 1) return funnel
  return {
    ...funnel,
    stages: funnel.stages.map((stage) => ({
      ...stage,
      count: Math.max(0, Math.round(stage.count * share)),
    })),
  }
}

function scopeRankItemsByCountry(
  items: SuperAdminRankItem[],
  destinations: SuperAdminDestinationMixItem[],
  country: SegmentCountryKey,
): SuperAdminRankItem[] {
  if (country === 'all') return items

  const dest = selectedDestination(destinations, country)
  if (!dest) return []

  const totalDestVol = destinations.reduce((sum, item) => sum + item.volume, 0)
  const destShare = dest.volume / Math.max(1, totalDestVol)
  const maxBase = Math.max(...items.map((item) => Number(item.value ?? 0)), 1)

  return items
    .map((item, index) => {
      if (item.destinationCountry && item.destinationCountry !== country) {
        return { ...item, value: 0, progress: 0 }
      }

      const base = Number(item.value ?? 0)
      const tagged = item.destinationCountry === country
      const skew = tagged ? 1 : 0.55 + ((index * 11) % 35) / 100
      const value = tagged
        ? base
        : Math.max(0, Math.round(base * destShare * skew * (items.length / 2.8)))

      return {
        ...item,
        value,
        progress: maxBase > 0 ? Math.min(100, Math.round((value / maxBase) * 100)) : 0,
      }
    })
    .filter((item) => Number(item.value) > 0)
    .sort((a, b) => Number(b.value) - Number(a.value))
}

function scopeTimelineByCountry(
  rows: MarineTimelineRow[],
  country: SegmentCountryKey,
  share: number,
): MarineTimelineRow[] {
  if (country === 'all') return rows

  const filtered = rows.filter((row) => {
    if (row.destinationCountry) return row.destinationCountry === country
    if (country === 'uae') return row.joiningPort.toLowerCase().includes('dubai')
    if (country === 'schengen') return row.vessel.toLowerCase().includes('nordic')
    if (country === 'uk') return row.visaStatus.toLowerCase().includes('uk')
    return false
  })

  if (filtered.length > 0) return filtered
  if (share <= 0) return []
  return rows.slice(0, Math.max(1, Math.round(rows.length * share)))
}

export function applyVerticalPreviewCountryScope(
  preview: SuperAdminVerticalPreview,
  country: SegmentCountryKey,
): SuperAdminVerticalPreview {
  if (country === 'all') return preview

  const share = destinationShare(preview.byDestination, country)
  const scopedDestinations = filterDestinations(preview.byDestination, country)

  return {
    ...preview,
    commercialKpis: scopeCommercialKpis(preview.commercialKpis, preview.byDestination, country),
    acquisitionFunnel: scopeFunnel(preview.acquisitionFunnel, share),
    byEntity: scopeRankItemsByCountry(preview.byEntity, preview.byDestination, country),
    byDestination: scopedDestinations.length > 0 ? scopedDestinations : [],
    pending: scopeRankItemsByCountry(preview.pending, preview.byDestination, country),
    topClients: scopeRankItemsByCountry(preview.topClients, preview.byDestination, country),
  }
}

export function applyMarineSegmentCountryScope(
  data: SuperAdminDashboardData,
  country: SegmentCountryKey,
) {
  if (country === 'all') {
    return {
      marineCommercialKpis: data.marineCommercialKpis,
      marineAcquisitionFunnel: data.marineAcquisitionFunnel,
      marineByCompany: data.marineByCompany,
      marineByDestination: data.marineByDestination,
      marineTimeline: data.marineTimeline,
      pendingCrewVisas: data.pendingCrewVisas,
    }
  }

  const share = destinationShare(data.marineByDestination, country)
  const scopedDestinations = filterDestinations(data.marineByDestination, country)

  return {
    marineCommercialKpis: scopeCommercialKpis(
      data.marineCommercialKpis,
      data.marineByDestination,
      country,
    ),
    marineAcquisitionFunnel: scopeFunnel(data.marineAcquisitionFunnel, share),
    marineByCompany: scopeRankItemsByCountry(
      data.marineByCompany,
      data.marineByDestination,
      country,
    ),
    marineByDestination: scopedDestinations,
    marineTimeline: scopeTimelineByCountry(data.marineTimeline, country, share),
    pendingCrewVisas: scopeRankItemsByCountry(
      data.pendingCrewVisas,
      data.marineByDestination,
      country,
    ),
  }
}
