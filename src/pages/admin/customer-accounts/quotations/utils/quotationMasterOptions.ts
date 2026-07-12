import type { AgreementWorkflowType } from '@/shared/types/commercialAgreement'
import type { ServiceType } from '@/shared/types/serviceMaster'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
import { applicabilityForWorkflow } from '@/shared/utils/agreementDocumentUtils'
import { shouldShowJurisdictionNodes } from '@/shared/utils/jurisdictionRequirementPreview'
import { workflowToSegment } from '@/pages/admin/customer-accounts/agreements/utils/agreementMasterOptions'
import type { ServicePickerOption } from '../components/pricing/SearchableServicePicker'

/** Active Service Master rows for quotation pickers, filtered by customer-type applicability. */
export function getServiceMasterPickerOptions(
  workflow: AgreementWorkflowType,
  options?: { excludeServiceTypes?: ServiceType[] },
): ServicePickerOption[] {
  const allowed = applicabilityForWorkflow(workflow)
  const excluded = new Set(options?.excludeServiceTypes ?? [])
  return serviceMasterService
    .list({ status: 'active' })
    .filter((s) => !excluded.has(s.serviceType))
    .filter((s) => s.applicableFor.some((a) => allowed.includes(a)))
    .map((s) => ({
      value: s.id,
      label: s.serviceName,
      defaultPrice: s.defaultPrice ?? 0,
      gstApplicable: Boolean(s.gstRateId),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

/** @deprecated Use getServiceMasterPickerOptions — Retail GLTS / misc pickers share Service Master. */
export function getGltsServicePickerOptions(workflow: AgreementWorkflowType): ServicePickerOption[] {
  return getServiceMasterPickerOptions(workflow, { excludeServiceTypes: ['vfs'] })
}

export function resolveVisaOfferingId(
  countryId: string,
  visaTypeName: string,
  workflow: AgreementWorkflowType,
): string | undefined {
  const country = countryMasterAdminService.getById(countryId)
  if (!country) return undefined
  const segment = workflowToSegment(workflow)
  const segments = segment
    ? country.segments.filter((s) => s.segment === segment && s.enabled)
    : country.segments.filter((s) => s.enabled)

  for (const seg of segments) {
    const match = seg.visaTypes.find(
      (v) => v.status === 'active' && v.name.trim().toLowerCase() === visaTypeName.trim().toLowerCase(),
    )
    if (match) return match.id
  }
  for (const seg of country.segments) {
    const match = seg.visaTypes.find(
      (v) => v.status === 'active' && v.name.trim().toLowerCase() === visaTypeName.trim().toLowerCase(),
    )
    if (match) return match.id
  }
  return undefined
}

export function getJurisdictionSelectOptions(
  countryId: string,
  visaOfferingId: string,
): { value: string; label: string }[] {
  const country = countryMasterAdminService.getById(countryId)
  if (!country) return []
  for (const seg of country.segments) {
    const visa = seg.visaTypes.find((v) => v.id === visaOfferingId)
    if (!visa) continue
    if (!shouldShowJurisdictionNodes(visa)) return []
    return (visa.jurisdictions ?? [])
      .filter((j) => j.status === 'active')
      .map((j) => ({ value: j.id, label: j.name }))
  }
  return []
}

export function getVisaTypeSelectOptionsWithIds(
  countryId: string,
  workflow: AgreementWorkflowType,
): { value: string; label: string; offeringId: string }[] {
  const country = countryMasterAdminService.getById(countryId)
  if (!country) return []
  const segment = workflowToSegment(workflow)
  const segments = segment
    ? country.segments.filter((s) => s.segment === segment && s.enabled)
    : country.segments.filter((s) => s.enabled)

  const seen = new Map<string, { value: string; label: string; offeringId: string }>()
  for (const seg of segments) {
    for (const v of seg.visaTypes.filter((vt) => vt.status === 'active')) {
      if (!seen.has(v.name)) {
        seen.set(v.name, { value: v.name, label: v.name, offeringId: v.id })
      }
    }
  }
  return [...seen.values()]
}
