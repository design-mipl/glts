import type { SuperAdminClientMarginItem, SuperAdminClientRow } from '../types'

export function parseRevenueLakhs(revenue: string): number {
  const trimmed = revenue.trim()
  const numeric = Number.parseFloat(trimmed.replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(numeric)) return 0
  if (/cr/i.test(trimmed)) return numeric * 100
  return numeric
}

export interface ClientMarginSeed {
  id: string
  client: string
  marginPercent: number
  segment?: string
  revenueMtdL?: number
  applicationsMtd?: number
  detail?: string
}

export function buildClientMarginItems(
  clientRows: SuperAdminClientRow[],
  seeds: ClientMarginSeed[],
): SuperAdminClientMarginItem[] {
  return seeds.map((seed) => {
    const row = clientRows.find((c) => c.client === seed.client)
    const revenueMtdL = seed.revenueMtdL ?? (row ? parseRevenueLakhs(row.revenue) : 0)
    const applicationsMtd = seed.applicationsMtd ?? row?.applications ?? 0
    return {
      id: seed.id,
      client: seed.client,
      segment: seed.segment ?? row?.segment ?? '—',
      marginPercent: seed.marginPercent,
      revenueMtdL,
      applicationsMtd,
      detail: seed.detail,
    }
  })
}
