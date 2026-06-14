import type { GroundServiceLine } from '@/shared/types/operationalCaseHandling'
import {
  DEFAULT_GROUND_SERVICE_NAMES,
  GROUND_SERVICE_DEFAULT_RATES,
} from '@/shared/types/operationalCaseHandling'

const DEFAULT_GROUND_SERVICE_NAME_SET = new Set<string>(DEFAULT_GROUND_SERVICE_NAMES)

/** Ensures every catalog ground service appears on a case, preserving saved state. */
export function ensureGroundServiceCatalog(services: GroundServiceLine[]): GroundServiceLine[] {
  const byName = new Map(services.map(service => [service.serviceName, service]))
  const catalog: GroundServiceLine[] = []

  DEFAULT_GROUND_SERVICE_NAMES.forEach((name, index) => {
    const existing = byName.get(name)
    if (existing) {
      catalog.push(existing)
      byName.delete(name)
      return
    }
    catalog.push({
      id: `svc-${index}`,
      serviceName: name,
      selected: false,
      prefilledAmount: GROUND_SERVICE_DEFAULT_RATES[name],
      actualAmount: 0,
      remarks: '',
    })
  })

  for (const extra of byName.values()) {
    catalog.push(extra)
  }

  return catalog
}

export function isCatalogGroundServiceName(name: string): boolean {
  return DEFAULT_GROUND_SERVICE_NAME_SET.has(name)
}
