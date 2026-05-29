import { useMemo, useState } from 'react'
import type { EnquiryFormData } from '@/shared/types/enquiry'

export const INITIAL_ENQUIRY_FORM: EnquiryFormData = {
  customer: {
    companyOrCustomerName: '',
    customerType: 'retail',
    contactPersonName: '',
    contactNumber: '',
    emailAddress: '',
    alternateContactNumber: '',
    companyWebsite: '',
    companyAddress: '',
  },
  visaRequirement: {
    countries: [],
    visaType: '',
    purposeOfVisit: '',
    processingType: '',
    numberOfApplicants: 1,
    marineRequirement: false,
    tentativeTravelDate: '',
    expectedProcessingTimeline: '',
    urgencyLevel: 'medium',
  },
  operationalRequirements: {
    bulkUploadRequired: false,
    documentPickupRequired: false,
    groundOperationsRequired: false,
    biometricsAssistanceRequired: false,
    courierSupportRequired: false,
    dedicatedSpocRequired: false,
  },
  salesDetails: {
    inquirySource: 'website',
    assignedSalesPerson: '',
    assignedOperationsTeam: '',
    branch: '',
    priorityLevel: 'medium',
  },
  notes: {
    initialDiscussionNotes: '',
    customerExpectations: '',
    specialInstructions: '',
    internalNotes: '',
  },
  attachments: [],
  followups: [],
  assignment: {},
}

export function useEnquiryForm(initialData?: EnquiryFormData) {
  const [formData, setFormData] = useState<EnquiryFormData>(initialData ?? INITIAL_ENQUIRY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setFieldError = (key: string, message?: string) => {
    setErrors((prev) => {
      const next = { ...prev }
      if (message) next[key] = message
      else delete next[key]
      return next
    })
  }

  const isValid = useMemo(() => Object.keys(errors).length === 0, [errors])

  const validate = () => {
    const next: Record<string, string> = {}
    if (!formData.customer.companyOrCustomerName.trim()) next.companyOrCustomerName = 'Customer name is required'
    if (!formData.customer.contactPersonName.trim()) next.contactPersonName = 'Contact person is required'
    if (!formData.customer.contactNumber.trim()) next.contactNumber = 'Contact number is required'
    if (!formData.customer.emailAddress.trim()) next.emailAddress = 'Email is required'
    if (!formData.visaRequirement.countries.length) next.countries = 'At least one country is required'
    if (!formData.visaRequirement.visaType.trim()) next.visaType = 'Visa type is required'
    if (!formData.salesDetails.inquirySource) next.inquirySource = 'Inquiry source is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const reset = () => {
    setFormData(initialData ?? INITIAL_ENQUIRY_FORM)
    setErrors({})
  }

  return {
    formData,
    setFormData,
    errors,
    setFieldError,
    isValid,
    validate,
    reset,
  }
}
