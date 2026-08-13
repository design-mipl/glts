import {
  GLTS_BATCH_IDS,
  getSingleApplicationDemoSeed,
  getSingleApplicationFlowExtras,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '../data/applicationFlowData'
import { GLTS_APPLICATION_IDS } from '../../../data/portalIds'
import type { ApplicationListingRow } from '../types/applicationListing.types'
import { isBulkRow } from '../types/applicationListing.types'
import { resolveApplicationCompanyName, resolveApplicationVesselName } from './applicationCompanyUtils'

export interface ApplicationReferenceFields {
  poCidNo: string
  compassNo: string
  joiningPort: string
  billingEntityName: string
}

/** Split legacy combined PO / CID / Compass value into separate fields. */
export function splitLegacyPoReference(value?: string): { poCidNo: string; compassNo: string } {
  const trimmed = (value ?? '').trim()
  if (!trimmed) return { poCidNo: '', compassNo: '' }
  if (trimmed.toUpperCase().startsWith('COMPASS')) {
    return { poCidNo: '', compassNo: trimmed }
  }
  return { poCidNo: trimmed, compassNo: '' }
}

function seedForListingRow(row: ApplicationListingRow) {
  if (!isBulkRow(row)) {
    return getSingleApplicationDemoSeed(row.id)
  }
  if (row.id === GLTS_BATCH_IDS.schengenCrew) {
    return getSingleApplicationDemoSeed(GLTS_APPLICATION_IDS.schengen)
  }
  return undefined
}

export function resolveApplicationPoCidNo(row: ApplicationListingRow): string {
  const explicit = row.poCidNo?.trim()
  if (explicit) return explicit
  const legacy = splitLegacyPoReference(row.poReference)
  if (legacy.poCidNo) return legacy.poCidNo
  return '—'
}

export function resolveApplicationCompassNo(row: ApplicationListingRow): string {
  const explicit = row.compassNo?.trim()
  if (explicit) return explicit
  const legacy = splitLegacyPoReference(row.poReference)
  if (legacy.compassNo) return legacy.compassNo
  return '—'
}

export function resolveApplicationJoiningPort(row: ApplicationListingRow): string {
  const explicit = row.joiningPort?.trim()
  if (explicit) return explicit
  const seed = seedForListingRow(row)
  const fromExtras = seed?.flowExtras.joiningPort?.trim()
  if (fromExtras) return fromExtras
  return '—'
}

export function resolveApplicationBillingEntity(row: ApplicationListingRow): string {
  const explicit = row.billingEntityName?.trim()
  if (explicit) return explicit
  const seed = seedForListingRow(row)
  const fromExtras = seed?.flowExtras.entityName?.trim()
  if (fromExtras) return fromExtras
  return '—'
}

export function resolveApplicationReferenceFields(row: ApplicationListingRow): ApplicationReferenceFields {
  return {
    poCidNo: resolveApplicationPoCidNo(row),
    compassNo: resolveApplicationCompassNo(row),
    joiningPort: resolveApplicationJoiningPort(row),
    billingEntityName: resolveApplicationBillingEntity(row),
  }
}

export function applicationReferenceFieldsFromFlow(input: {
  poCidNo?: string
  compassNo?: string
  referencePo?: string
  joiningPort?: string
  entityName?: string
}): Pick<SingleApplicationRow, 'poCidNo' | 'compassNo' | 'joiningPort' | 'billingEntityName' | 'poReference'> {
  const poCidNo = input.poCidNo?.trim() || splitLegacyPoReference(input.referencePo).poCidNo
  const compassNo = input.compassNo?.trim() || splitLegacyPoReference(input.referencePo).compassNo
  const joiningPort = input.joiningPort?.trim()
  const billingEntityName = input.entityName?.trim()
  const poReference = poCidNo || input.referencePo?.trim() || undefined

  return {
    ...(poCidNo ? { poCidNo } : {}),
    ...(compassNo ? { compassNo } : {}),
    ...(joiningPort ? { joiningPort } : {}),
    ...(billingEntityName ? { billingEntityName } : {}),
    ...(poReference ? { poReference } : {}),
  }
}

export type ApplicationListingReferenceRow = SingleApplicationRow | BulkBatchRow

export function buildApplicationOverviewOverrides(
  listingRow?: ApplicationListingReferenceRow | null,
  applicationId?: string,
): {
  companyName?: string
  vesselName?: string
  poCidNo?: string
  compassNo?: string
  joiningPort?: string
  billingEntityName?: string
  entityName?: string
} {
  const extras = applicationId ? getSingleApplicationFlowExtras(applicationId) : undefined

  const pick = (resolved?: string, fallback?: string) => {
    const primary = (resolved ?? '').trim()
    if (primary && primary !== '—') return primary
    const secondary = (fallback ?? '').trim()
    return secondary || undefined
  }

  return {
    companyName: listingRow ? resolveApplicationCompanyName(listingRow) : undefined,
    vesselName: pick(
      listingRow ? resolveApplicationVesselName(listingRow) : undefined,
      extras?.vesselName,
    ),
    poCidNo: pick(listingRow ? resolveApplicationPoCidNo(listingRow) : undefined, extras?.poCidNo),
    compassNo: pick(
      listingRow ? resolveApplicationCompassNo(listingRow) : undefined,
      extras?.compassNo,
    ),
    joiningPort: pick(
      listingRow ? resolveApplicationJoiningPort(listingRow) : undefined,
      extras?.joiningPort,
    ),
    billingEntityName: pick(
      listingRow ? resolveApplicationBillingEntity(listingRow) : undefined,
      extras?.entityName,
    ),
    entityName: extras?.entityName?.trim() || undefined,
  }
}
