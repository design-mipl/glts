import { serviceMasterService } from '@/shared/services/serviceMasterService'
import type { SimpleDocumentRequirementId } from '@/shared/utils/applicantDocumentWorkflowUtils'

export interface GltsDocumentVendorOption {
  value: string
  label: string
}

function isInsuranceVendor(serviceName: string, subcategory?: string): boolean {
  const haystack = `${serviceName} ${subcategory ?? ''}`.toLowerCase()
  return haystack.includes('insurance')
}

function isTravelTicketVendor(
  serviceName: string,
  category: string,
  subcategory?: string,
): boolean {
  const haystack = `${serviceName} ${category} ${subcategory ?? ''}`.toLowerCase()
  return (
    haystack.includes('ticket') ||
    haystack.includes('itinerary') ||
    haystack.includes('courier') ||
    category === 'Travel Support'
  )
}

export function listGltsDocumentUploadVendors(
  documentId: SimpleDocumentRequirementId,
): GltsDocumentVendorOption[] {
  const vendors = serviceMasterService.list({ serviceType: 'vendor', status: 'active' })
  const filtered =
    documentId === 'insurance'
      ? vendors.filter(v => isInsuranceVendor(v.serviceName, v.subcategory))
      : vendors.filter(v => isTravelTicketVendor(v.serviceName, v.category, v.subcategory))

  return filtered.map(v => ({
    value: v.id,
    label: v.serviceName,
  }))
}

export function resolveGltsDocumentVendorName(vendorId: string | undefined): string {
  const id = vendorId?.trim()
  if (!id) return ''
  return serviceMasterService.getById(id)?.serviceName?.trim() ?? ''
}

export function isValidGltsArrangementAmount(value: string | undefined): boolean {
  const trimmed = value?.trim()
  if (!trimmed) return false
  const num = Number(trimmed)
  return !Number.isNaN(num) && num > 0
}
