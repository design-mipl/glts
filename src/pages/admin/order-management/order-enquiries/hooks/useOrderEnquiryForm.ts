import { useMemo, useState } from 'react'
import type { OrderEnquiryFormData } from '@/shared/types/orderEnquiry'

export const INITIAL_ORDER_ENQUIRY_FORM: OrderEnquiryFormData = {
  status: 'new',
  source: 'admin',
  service: 'attestation',
  customer: {
    companyOrCustomerName: '',
    contactPersonName: '',
    contactNumber: '',
    emailAddress: '',
    companyAddress: '',
  },
  notes: '',
}

export function useOrderEnquiryForm(initialData?: OrderEnquiryFormData) {
  const [formData, setFormData] = useState<OrderEnquiryFormData>(initialData ?? INITIAL_ORDER_ENQUIRY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.customer.companyOrCustomerName.trim()) {
      next.companyOrCustomerName = 'Customer / company name is required'
    }
    if (!formData.customer.contactPersonName.trim()) {
      next.contactPersonName = 'Contact person is required'
    }
    if (!formData.customer.contactNumber.trim()) {
      next.contactNumber = 'Mobile number is required'
    }
    if (!formData.customer.emailAddress.trim()) {
      next.emailAddress = 'Email is required'
    }
    if (!formData.customer.companyAddress.trim()) {
      next.companyAddress = 'Company address is required'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  return {
    formData,
    setFormData,
    errors,
    isValid,
    validate,
  }
}
