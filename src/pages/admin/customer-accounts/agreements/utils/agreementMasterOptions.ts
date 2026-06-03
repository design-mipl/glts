import type { BusinessSegment } from '@/shared/types/countryMaster'
import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
import type { MasterApplicability } from '@/shared/types/masterCommon'

export function workflowToSegment(workflow: AgreementWorkflowType): BusinessSegment | undefined {
  switch (workflow) {
    case 'marine':
      return 'marine'
    case 'corporate':
      return 'corporate'
    case 'b2b_agent':
      return 'b2bAgents'
    case 'retail':
      return 'retail'
    case 'mixed':
      return undefined
    default:
      return undefined
  }
}

/** Applicability segments shown in Service Master for each agreement workflow. */
function applicabilityForWorkflow(workflow: AgreementWorkflowType): MasterApplicability[] {
  const map: Record<AgreementWorkflowType, MasterApplicability[]> = {
    marine: ['marine'],
    corporate: ['corporate', 'b2b'],
    b2b_agent: ['b2b', 'corporate'],
    retail: ['retail'],
    mixed: ['marine', 'corporate', 'b2b', 'retail'],
  }
  return map[workflow] ?? ['marine', 'corporate', 'b2b', 'retail']
}

export function getCountrySelectOptions() {
  return countryMasterAdminService
    .list({ status: 'active' })
    .map((c) => ({ value: c.id, label: c.name, countryName: c.name }))
}

export function getVisaTypeOptions(countryId: string, workflow: AgreementWorkflowType) {
  const country = countryMasterAdminService.getById(countryId)
  if (!country) return []
  const segment = workflowToSegment(workflow)
  const segments = segment
    ? country.segments.filter((s) => s.segment === segment && s.enabled)
    : country.segments.filter((s) => s.enabled && s.segment !== 'retail')

  const visaTypes = new Set<string>()
  segments.forEach((seg) => {
    seg.visaTypes.filter((v) => v.status === 'active').forEach((v) => visaTypes.add(v.name))
  })
  return [...visaTypes].map((name) => ({ value: name, label: name }))
}

export interface AgreementServiceOption {
  value: string
  label: string
  defaultPrice: number
}

/** Active services from Service Master, filtered by agreement workflow applicability. */
export function getServiceOptions(workflow: AgreementWorkflowType): AgreementServiceOption[] {
  const allowed = applicabilityForWorkflow(workflow)
  return serviceMasterService
    .list({ status: 'active' })
    .filter((s) => s.applicableFor.some((a) => allowed.includes(a)))
    .map((s) => ({
      value: s.id,
      label: s.serviceName,
      defaultPrice: s.defaultPrice ?? 0,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

/** @deprecated Use getServiceOptions — kept for existing imports */
export const getServicePresetOptions = getServiceOptions

export function resolveServiceFee(serviceId: string): number {
  const service = serviceMasterService.getById(serviceId)
  return service?.defaultPrice ?? 0
}

/** @deprecated Use resolveServiceFee */
export const resolveServicePresetFee = resolveServiceFee

export function workflowTypeDisplayLabel(workflow: AgreementWorkflowType): string {
  switch (workflow) {
    case 'marine':
      return 'Marine'
    case 'corporate':
      return 'Corporate'
    case 'b2b_agent':
      return 'B2B Agent'
    case 'retail':
      return 'Retail'
    case 'mixed':
      return 'Mixed'
    default:
      return 'Corporate'
  }
}
