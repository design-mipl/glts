import { serviceMasterService } from '@/shared/services/serviceMasterService'
import type { GroundServiceLine } from '@/shared/types/operationalCaseHandling'

/** GLTS Fee Master service IDs for ground-ops selectable charges. */
export const GLTS_OPS_FEE_SERVICE_MASTER_IDS = [
  'svc-photo-charges',
  'svc-print-out-charges',
  'svc-urgent-charges',
] as const

const FALLBACK_NAMES: Record<(typeof GLTS_OPS_FEE_SERVICE_MASTER_IDS)[number], string> = {
  'svc-photo-charges': 'Photo Charges',
  'svc-print-out-charges': 'Print Out Charges',
  'svc-urgent-charges': 'Urgent Charges',
}

/**
 * Builds the ground-ops GLTS charge checklist from Fee Master defaults,
 * preserving prior selection and edited amounts.
 */
export function ensureGltsOpsFeeCatalog(existing: GroundServiceLine[] = []): GroundServiceLine[] {
  const byId = new Map(existing.map(line => [line.id, line]))

  return GLTS_OPS_FEE_SERVICE_MASTER_IDS.map(serviceMasterId => {
    const master = serviceMasterService.getById(serviceMasterId)
    const prior = byId.get(serviceMasterId)
    const defaultPrice =
      master?.status === 'active' && master.defaultPrice != null && master.defaultPrice >= 0
        ? master.defaultPrice
        : (prior?.prefilledAmount ?? 0)

    return {
      id: serviceMasterId,
      serviceName: master?.serviceName ?? FALLBACK_NAMES[serviceMasterId],
      selected: prior?.selected ?? false,
      prefilledAmount: defaultPrice,
      actualAmount: prior?.actualAmount ?? 0,
      receiptFileName: prior?.receiptFileName,
      remarks: prior?.remarks,
    }
  })
}
