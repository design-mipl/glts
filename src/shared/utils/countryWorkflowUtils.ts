import {
  getCountryMasterById,
  getCountryMasterByName,
} from '@/shared/services/countryMasterService'
import { workflowMasterService } from '@/shared/services/workflowMasterService'
import type { CountryMaster, CountrySegmentConfig, CountryVisaType } from '@/shared/types/countryMaster'
import type { WorkflowMaster } from '@/shared/types/workflowMaster'

function normalizeLabel(value: string | undefined | null): string {
  return (value ?? '').trim().toLowerCase().replace(/[·•]/g, ' ').replace(/\s+/g, ' ')
}

/** Visa-type mapping wins when set; otherwise fall back to segment default. */
export function resolveCountryWorkflowId(
  segment: Pick<CountrySegmentConfig, 'workflowId'> | undefined,
  visaType?: Pick<CountryVisaType, 'workflowId'> | null,
): string | undefined {
  const override = visaType?.workflowId?.trim()
  if (override) return override
  const segmentId = segment?.workflowId?.trim()
  return segmentId || undefined
}

export function getActiveWorkflowSelectOptions(): { value: string; label: string }[] {
  return workflowMasterService
    .list({ status: 'active' })
    .map((row) => ({ value: row.id, label: row.name }))
}

export function getWorkflowDisplayName(workflowId: string | undefined | null): string {
  if (!workflowId?.trim()) return '—'
  return workflowMasterService.getById(workflowId)?.name ?? workflowId
}

function visaTypeMatches(visaType: CountryVisaType, visaTypeLabel: string): boolean {
  const needle = normalizeLabel(visaTypeLabel)
  if (!needle) return false
  const name = normalizeLabel(visaType.name)
  const id = normalizeLabel(visaType.id)
  return (
    name === needle ||
    id === needle ||
    name.includes(needle) ||
    needle.includes(name) ||
    id.includes(needle)
  )
}

export function findCountryVisaContext(input: {
  countryId?: string
  countryName?: string
  visaTypeLabel?: string
  visaOfferingId?: string
}): { country: CountryMaster; segment: CountrySegmentConfig; visaType?: CountryVisaType } | undefined {
  const country =
    (input.countryId ? getCountryMasterById(input.countryId) : undefined) ??
    (input.countryName ? getCountryMasterByName(input.countryName) : undefined)
  if (!country) return undefined

  const offeringId = input.visaOfferingId?.trim()
  if (offeringId) {
    for (const segment of country.segments) {
      const visaType = segment.visaTypes.find((entry) => entry.id === offeringId)
      if (visaType) return { country, segment, visaType }
    }
  }

  const label = input.visaTypeLabel?.trim()
  if (label) {
    for (const segment of country.segments) {
      const visaType = segment.visaTypes.find((entry) => visaTypeMatches(entry, label))
      if (visaType) return { country, segment, visaType }
    }
  }

  const prefersMarine = /crew|marine|sticker/i.test(label ?? '')
  const enabledWithWorkflow = country.segments.filter(
    (segment) => segment.enabled && Boolean(segment.workflowId?.trim()),
  )
  const enabledSegment =
    (prefersMarine
      ? enabledWithWorkflow.find((segment) => segment.segment === 'marine')
      : undefined) ??
    enabledWithWorkflow[0] ??
    country.segments.find((segment) => segment.enabled) ??
    country.segments[0]

  if (!enabledSegment) return undefined
  return { country, segment: enabledSegment }
}

/** Resolve Workflow Master for an application from country + visa context. */
export function resolveApplicationWorkflow(input: {
  workflowId?: string
  countryId?: string
  countryName?: string
  visaTypeLabel?: string
  visaOfferingId?: string
}): WorkflowMaster | undefined {
  const explicit = input.workflowId?.trim()
  if (explicit) return workflowMasterService.getById(explicit)

  const ctx = findCountryVisaContext(input)
  if (!ctx) return undefined

  const workflowId = resolveCountryWorkflowId(ctx.segment, ctx.visaType)
  if (!workflowId) return undefined
  return workflowMasterService.getById(workflowId)
}
