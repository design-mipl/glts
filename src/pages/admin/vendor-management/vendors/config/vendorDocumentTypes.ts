import type { VendorDocumentType } from '@/shared/types/vendor'

export const vendorDocumentTypeLabel: Record<VendorDocumentType, string> = {
  gst_certificate: 'GST Certificate',
  pan_card: 'PAN Card',
  cancelled_cheque: 'Cancelled Cheque',
  agreement_contract: 'Agreement / Contract',
  other: 'Other Documents',
}

export const VENDOR_DOCUMENT_TYPE_OPTIONS = (Object.keys(vendorDocumentTypeLabel) as VendorDocumentType[]).map(
  (value) => ({
    value,
    label: vendorDocumentTypeLabel[value],
  }),
)
