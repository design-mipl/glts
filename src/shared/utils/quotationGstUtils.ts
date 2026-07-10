import { taxMasterService } from '@/shared/services/taxMasterService'

export const DEFAULT_QUOTATION_GST_RATE_ID = 'gst-18'

export function syncQuotationGstFromRateId(gstRateId: string): {
  gstRateId: string
  gstPercentage: number
} {
  return {
    gstRateId,
    gstPercentage: taxMasterService.getGstPercent(gstRateId) ?? 0,
  }
}

export function resolveQuotationGstRateId(record: {
  gstRateId?: string | null
  gstPercentage: number
}): string {
  if (record.gstRateId && taxMasterService.getGstById(record.gstRateId)) {
    return record.gstRateId
  }
  const matched = taxMasterService
    .listActiveGstOptions()
    .find((option) => taxMasterService.getGstPercent(option.value) === record.gstPercentage)
  return matched ? String(matched.value) : DEFAULT_QUOTATION_GST_RATE_ID
}

export function getDefaultQuotationGstSelection() {
  const gstRateId = taxMasterService.getGstById(DEFAULT_QUOTATION_GST_RATE_ID)
    ? DEFAULT_QUOTATION_GST_RATE_ID
    : String(taxMasterService.listActiveGstOptions()[0]?.value ?? DEFAULT_QUOTATION_GST_RATE_ID)
  return syncQuotationGstFromRateId(gstRateId)
}
