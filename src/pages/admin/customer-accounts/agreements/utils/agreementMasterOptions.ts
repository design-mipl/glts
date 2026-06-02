import type { BusinessSegment } from '@/shared/types/countryMaster'
import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import { serviceMasterService } from '@/shared/services/serviceMasterService'

export function workflowToSegment(workflow: AgreementWorkflowType): BusinessSegment | undefined {
  switch (workflow) {
    case 'marine':
      return 'marine'
    case 'corporate':
      return 'corporate'
    case 'b2b_agent':
      return 'b2bAgents'
    case 'mixed':
      return undefined
    default:
      return undefined
  }
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

export function getServicePresetOptions(workflow: AgreementWorkflowType) {
  const applicabilityMap: Record<string, string[]> = {
    marine: ['marine'],
    corporate: ['corporate', 'b2b'],
    b2b_agent: ['b2b', 'corporate'],
    mixed: ['marine', 'corporate', 'b2b', 'retail'],
  }
  const allowed = applicabilityMap[workflow] ?? ['corporate', 'b2b', 'marine']
  return serviceMasterService
    .list({ status: 'active' })
    .filter((s) => s.applicableFor.some((a) => allowed.includes(a)))
    .map((s) => ({
      value: s.id,
      label: s.serviceName,
      defaultPrice: s.defaultPrice ?? 0,
    }))
}

export function resolveServiceFee(servicePresetId: string): number {
  const service = serviceMasterService.getById(servicePresetId)
  return service?.defaultPrice ?? 0
}

export function workflowTypeDisplayLabel(workflow: AgreementWorkflowType): string {
  switch (workflow) {
    case 'marine':
      return 'Marine'
    case 'corporate':
      return 'Corporate'
    case 'b2b_agent':
      return 'B2B Agent'
    case 'mixed':
      return 'Mixed'
    default:
      return 'Corporate'
  }
}
