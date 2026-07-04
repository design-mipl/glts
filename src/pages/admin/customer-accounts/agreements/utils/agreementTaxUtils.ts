import { taxMasterService } from '@/shared/services/taxMasterService'
import type { AgreementBillingConfig } from '@/shared/types/commercialAgreement'

export const AGREEMENT_TAX_APPLICABLE_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
] as const

export function resolveAgreementGstRateId(billingConfig: Pick<AgreementBillingConfig, 'gstApplicable' | 'gstPercentage'>): string {
  if (!billingConfig.gstApplicable) return ''
  const matched = taxMasterService
    .listActiveGstOptions()
    .find((option) => taxMasterService.getGstPercent(option.value) === billingConfig.gstPercentage)
  return matched ? String(matched.value) : ''
}

export function resolveAgreementTdsSectionId(
  billingConfig: Pick<AgreementBillingConfig, 'tdsApplicable' | 'tdsPercentage'>,
): string {
  if (!billingConfig.tdsApplicable) return ''
  const matched = taxMasterService
    .listActiveTdsOptions()
    .find((option) => taxMasterService.getTdsPercent(option.value) === billingConfig.tdsPercentage)
  return matched ? String(matched.value) : ''
}

export function syncAgreementGstFromRateId(gstRateId: string): Pick<AgreementBillingConfig, 'gstApplicable' | 'gstPercentage'> {
  if (!gstRateId) {
    return { gstApplicable: false, gstPercentage: 0 }
  }
  return {
    gstApplicable: true,
    gstPercentage: taxMasterService.getGstPercent(gstRateId) ?? 0,
  }
}

export function syncAgreementTdsFromSectionId(
  tdsSectionId: string,
): Pick<AgreementBillingConfig, 'tdsApplicable' | 'tdsPercentage'> {
  if (!tdsSectionId) {
    return { tdsApplicable: false, tdsPercentage: 0 }
  }
  return {
    tdsApplicable: true,
    tdsPercentage: taxMasterService.getTdsPercent(tdsSectionId) ?? 0,
  }
}
