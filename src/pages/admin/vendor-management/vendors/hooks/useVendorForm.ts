import { useCallback, useState } from 'react'
import { vendorService } from '@/shared/services/vendorService'
import type { VendorFormData } from '@/shared/types/vendor'

export const EMPTY_VENDOR_FORM: VendorFormData = {
  vendorName: '',
  vendorCategory: 'other',
  vendorType: 'company',
  contactPerson: '',
  mobileNumber: '',
  emailAddress: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  serviceCountry: '',
  visaType: '',
  panNumber: '',
  gstApplicable: true,
  gstNumber: '',
  status: 'active',
  commercial: {
    paymentTerms: '30_days',
    creditAllowed: false,
    creditLimit: null,
    advanceRequired: false,
    advanceAmount: null,
    advancePercentage: null,
    settlementType: 'per_service',
    tdsApplicable: false,
    tdsPercentage: null,
    notes: '',
  },
  bank: {
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
  },
  serviceMappings: [],
}

export function validateVendorForm(data: VendorFormData): string[] {
  const issues: string[] = []
  if (!data.vendorName.trim()) issues.push('Vendor name is required')
  if (!data.contactPerson.trim()) issues.push('Contact person is required')
  if (!data.mobileNumber.trim()) issues.push('Mobile number is required')
  if (!data.emailAddress.trim()) issues.push('Email address is required')
  if (data.gstApplicable && !data.gstNumber.trim()) issues.push('GST number is required when GST is applicable')
  if (data.commercial.creditAllowed && !data.commercial.creditLimit) issues.push('Credit limit is required when credit is allowed')
  if (data.commercial.advanceRequired && !data.commercial.advanceAmount && !data.commercial.advancePercentage) {
    issues.push('Advance amount or percentage is required when advance is required')
  }
  if (data.commercial.tdsApplicable && !data.commercial.tdsPercentage) issues.push('TDS percentage is required when TDS is applicable')
  return issues
}

export function useVendorForm() {
  const [formData, setFormData] = useState<VendorFormData>(EMPTY_VENDOR_FORM)
  const [dirty, setDirty] = useState(false)

  const loadFromVendor = useCallback((vendorId: string) => {
    const vendor = vendorService.getById(vendorId)
    if (!vendor) return false
    setFormData(vendorService.vendorToFormData(vendor))
    setDirty(false)
    return true
  }, [])

  const updateForm = useCallback((next: VendorFormData) => {
    setFormData(next)
    setDirty(true)
  }, [])

  const resetForm = useCallback(() => {
    setFormData(EMPTY_VENDOR_FORM)
    setDirty(false)
  }, [])

  return { formData, setFormData: updateForm, dirty, loadFromVendor, resetForm }
}
