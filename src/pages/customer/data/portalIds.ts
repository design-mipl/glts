/** Canonical GLTS identifiers for customer portal mock data and UI copy */

export const GLTS_APPLICATION_IDS = {
  schengen: 'GLTS-APP-2026-847',
  japan: 'GLTS-APP-2026-901',
  uae: 'GLTS-APP-2026-712',
} as const

export const GLTS_BOOKER_IDS = {
  priya: 'GLTS-BKR-001',
  james: 'GLTS-BKR-002',
} as const

export const GLTS_ACTION_IDS = {
  bankStatements: 'GLTS-ACT-001',
  retakePhoto: 'GLTS-ACT-002',
  biometrics: 'GLTS-ACT-003',
} as const

export const GLTS_NOTIFICATION_IDS = {
  embassy: 'GLTS-NOT-001',
  documentRejected: 'GLTS-NOT-002',
  invoice: 'GLTS-NOT-003',
} as const

export const GLTS_APPLICANT_IDS = {
  priya: 'GLTS-APL-001',
  jamie: 'GLTS-APL-002',
} as const

export const GLTS_INVOICE_ID = 'GLTS-INV-8821'

export const GLTS_ENTITY_IDS = {
  mumbaiBranch: 'GLTS-ENT-001',
  singaporeSubsidiary: 'GLTS-ENT-002',
  dubaiOffice: 'GLTS-ENT-003',
  londonBranch: 'GLTS-ENT-004',
  chennaiBranch: 'GLTS-ENT-005',
} as const

export const GLTS_VESSEL_IDS = {
  oceanStar: 'GLTS-VSL-001',
  pacificGlory: 'GLTS-VSL-002',
  northernWind: 'GLTS-VSL-003',
  offshoreExplorer: 'GLTS-VSL-004',
  seaPhoenix: 'GLTS-VSL-005',
} as const

export const GLTS_ADMIN_IDS = {
  sneha: 'GLTS-ADM-001',
  arun: 'GLTS-ADM-002',
  karan: 'GLTS-ADM-003',
} as const

/** @deprecated Use GLTS_ADMIN_IDS */
export const GLTS_USER_IDS = GLTS_ADMIN_IDS

/** Legacy IDs migrated in session / deep links */
export const LEGACY_APPLICATION_ID_MAP: Record<string, string> = {
  'GLT-2026-847': GLTS_APPLICATION_IDS.schengen,
  'GLT-2026-901': GLTS_APPLICATION_IDS.japan,
  'GLT-2026-712': GLTS_APPLICATION_IDS.uae,
  'APP-9923-847': GLTS_APPLICATION_IDS.schengen,
  'APP-9923-901': GLTS_APPLICATION_IDS.japan,
  'APP-9923-712': GLTS_APPLICATION_IDS.uae,
}

export function normalizeApplicationId(id: string | undefined): string | undefined {
  if (!id) return id
  return LEGACY_APPLICATION_ID_MAP[id] ?? id
}

export const LEGACY_BOOKER_ID_MAP: Record<string, string> = {
  '1': GLTS_BOOKER_IDS.priya,
  '2': GLTS_BOOKER_IDS.james,
}

export function normalizeBookerId(id: string | undefined): string | undefined {
  if (!id) return id
  return LEGACY_BOOKER_ID_MAP[id] ?? id
}

export function normalizeEntityId(id: string | undefined): string | undefined {
  if (!id) return id
  return id
}

export function normalizeVesselId(id: string | undefined): string | undefined {
  if (!id) return id
  return id
}

export function normalizeAdminId(id: string | undefined): string | undefined {
  if (!id) return id
  return id
}

/** @deprecated Use normalizeAdminId */
export function normalizePortalUserId(id: string | undefined): string | undefined {
  return normalizeAdminId(id)
}
